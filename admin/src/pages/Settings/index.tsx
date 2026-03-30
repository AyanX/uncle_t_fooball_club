// pages/Settings/index.tsx — Admin credentials + club stats, mission/vision, milestones, management, socials
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Save, Eye, EyeOff, Globe, Users, Trophy, BookOpen } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { ClubStat, MissionVisionItem, Milestone, Management } from '@/data/dummyData';
import { Field, Input, Textarea, Btn, ConfirmDialog, Modal } from '@/components/ui';
import styles from './Settings.module.scss';

// ─── Credentials ────────────────────────────────────────
const CredentialsPanel: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [email, setEmail]     = useState(user?.email || '');
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [repeat, setRepeat]   = useState('');
  const [show, setShow]       = useState(false);
  const [saving, setSaving]   = useState(false);

  const save = async () => {
    if (newPass && newPass !== repeat) { error('Passwords do not match'); return; }
    if (newPass && !current) { error('Current password required'); return; }
    setSaving(true);
    try {
      await api.auth.changeCredentials({ current_password: current, new_password: newPass, email });
      success('Credentials updated');
      setCurrent(''); setNewPass(''); setRepeat('');
    } catch { error('Failed to update credentials'); } finally { setSaving(false); }
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.panelTitle}>Admin Credentials</h3>
      <div className={styles.formGrid}>
        <div style={{ gridColumn: '1/-1' }}>
          <Field label="Email Address"><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
        </div>
        <Field label="Current Password">
          <div style={{ position: 'relative' }}>
            <Input type={show ? 'text' : 'password'} value={current} onChange={e => setCurrent(e.target.value)} placeholder="Enter current password" />
            <button onClick={() => setShow(!show)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#718096' }}>
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>
        <div />
        <Field label="New Password"><Input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Leave blank to keep current" /></Field>
        <Field label="Confirm New Password"><Input type="password" value={repeat} onChange={e => setRepeat(e.target.value)} placeholder="Repeat new password" /></Field>
      </div>
      <div className={styles.panelFooter}><Btn loading={saving} onClick={save}><Save size={14} /> Save Credentials</Btn></div>
    </div>
  );
};

// ─── Socials panel ──────────────────────────────────────
const SocialsPanel: React.FC = () => {
  const { socials, setSocials } = useAdminData();
  const { success, error } = useToast();
  const [form, setForm] = useState({ ...socials });
  const [saving, setSaving] = useState(false);
  useEffect(() => { setForm({ ...socials }); }, [socials]);
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const save = async () => {
    setSaving(true);
    try { await api.put.socials(form); setSocials(form); success('Contact info updated'); }
    catch { error('Failed to save'); } finally { setSaving(false); }
  };
  const fields: [string, string, string][] = [
    ['address','Address','National Main Stadium, Dar es Salaam'],
    ['phone_number','Phone Number','+255 123 456 789'],
    ['email','Email Address','info@kilimanjaro-fc.com'],
    ['location','Location','Dar es Salaam, Tanzania'],
    ['open_day','Open Day','Mon'],
    ['close_day','Close Day','Fri'],
    ['open_hours','Opening Hours','8:00'],
    ['close_hours','Closing Hours','17:00'],
    ['twitter','Twitter URL','https://twitter.com/...'],
    ['facebook','Facebook URL','https://facebook.com/...'],
    ['instagram','Instagram URL','https://instagram.com/...'],
    ['youtube','YouTube URL','https://youtube.com/...'],
  ];
  return (
    <div className={styles.panel}>
      <h3 className={styles.panelTitle}>Contact & Social Info</h3>
      <div className={styles.formGrid}>
        {fields.map(([k, label, placeholder]) => (
          <Field key={k} label={label}>
            <Input value={(form as any)[k] || ''} onChange={e => set(k, e.target.value)} placeholder={placeholder} />
          </Field>
        ))}
      </div>
      <div className={styles.panelFooter}><Btn loading={saving} onClick={save}><Save size={14} /> Save Contact Info</Btn></div>
    </div>
  );
};

// ─── Club Stats panel ───────────────────────────────────
const StatsPanel: React.FC = () => {
  const { stats, setStats } = useAdminData();
  const { success, error } = useToast();
  const [editItem, setEditItem] = useState<ClubStat | null>(null);
  const [form, setForm] = useState({ label: '', value: '', icon: 'Trophy' });
  const [addOpen, setAddOpen] = useState(false);
  const [delTarget, setDelTarget] = useState<ClubStat | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const ICONS = ['Trophy','Calendar','Users','Globe','Star','Target'];

  const openEdit = (s: ClubStat) => { setForm({ label: s.label, value: s.value, icon: s.icon }); setEditItem(s); };
  const handleSave = async () => {
    setSaving(true);
    try {
      if (editItem) {
        await api.put.stat(editItem.id, form);
        setStats(stats.map(s => s.id === editItem.id ? { ...editItem, ...form } : s));
        success('Stat updated'); setEditItem(null);
      } else {
        await api.post.stat(form);
        setStats([...stats, { id: Date.now(), ...form }]);
        success('Stat added'); setAddOpen(false);
      }
    } catch { error('Failed'); } finally { setSaving(false); }
  };
  const handleDel = async () => {
    if (!delTarget) return; setDeleting(true);
    try { await api.delete.stat(delTarget.id); setStats(stats.filter(s => s.id !== delTarget.id)); success('Stat deleted'); setDelTarget(null); }
    catch { error('Failed'); } finally { setDeleting(false); }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Club Statistics</h3>
        <Btn variant="secondary" onClick={() => { setForm({ label: '', value: '', icon: 'Trophy' }); setAddOpen(true); }}><Plus size={13} /> Add Stat</Btn>
      </div>
      <div className={styles.statGrid}>
        {stats.map(s => (
          <div key={s.id} className={styles.statCard}>
            <span className={styles.statVal}>{s.value}</span>
            <span className={styles.statLbl}>{s.label}</span>
            <div className={styles.statActions}>
              <button className={styles.iconBtn} onClick={() => openEdit(s)}><Pencil size={12} /></button>
              <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setDelTarget(s)}><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
        <div className={styles.statAddSlot} onClick={() => { setForm({ label: '', value: '', icon: 'Trophy' }); setAddOpen(true); }}><Plus size={20} /></div>
      </div>
      <Modal open={addOpen || !!editItem} onClose={() => { setAddOpen(false); setEditItem(null); }} title={editItem ? 'Edit Stat' : 'Add Stat'} size="sm">
        <div className={styles.formGrid}>
          <Field label="Label"><Input value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="League Titles" /></Field>
          <Field label="Value"><Input value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} placeholder="8" /></Field>
          <div style={{ gridColumn: '1/-1' }}>
            <Field label="Icon">
              <select value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} style={{ width: '100%', padding: '10px 14px', background: '#F8F9FA', border: '2px solid rgba(10,20,47,0.1)', borderRadius: 8, fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#0A142F', outline: 'none' }}>
                {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </Field>
          </div>
        </div>
        <div className={styles.panelFooter}>
          <Btn variant="secondary" onClick={() => { setAddOpen(false); setEditItem(null); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}>{editItem ? 'Save' : 'Add'}</Btn>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDel} loading={deleting} title="Delete Stat?" message={`Delete "${delTarget?.label}"?`} />
    </div>
  );
};

// ─── Mission/Vision panel ────────────────────────────────
const MissionPanel: React.FC = () => {
  const { missionVision, setMissionVision } = useAdminData();
  const { success, error } = useToast();
  const [editItem, setEditItem] = useState<MissionVisionItem | null>(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [addOpen, setAddOpen] = useState(false);
  const [delTarget, setDelTarget] = useState<MissionVisionItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openEdit = (m: MissionVisionItem) => { setForm({ title: m.title, content: m.content }); setEditItem(m); };
  const handleSave = async () => {
    setSaving(true);
    try {
      if (editItem) {
        await api.put.missionVision(editItem.id, form);
        setMissionVision(missionVision.map(m => m.id === editItem.id ? { ...editItem, ...form } : m));
        success('Updated'); setEditItem(null);
      } else {
        await api.post.missionVision(form);
        setMissionVision([...missionVision, { id: Date.now(), ...form }]);
        success('Added'); setAddOpen(false);
      }
    } catch { error('Failed'); } finally { setSaving(false); }
  };
  const handleDel = async () => {
    if (!delTarget) return; setDeleting(true);
    try { await api.delete.missionVision(delTarget.id); setMissionVision(missionVision.filter(m => m.id !== delTarget.id)); success('Deleted'); setDelTarget(null); }
    catch { error('Failed'); } finally { setDeleting(false); }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Mission & Vision</h3>
        <Btn variant="secondary" onClick={() => { setForm({ title: '', content: '' }); setAddOpen(true); }}><Plus size={13} /> Add</Btn>
      </div>
      <div className={styles.listItems}>
        {missionVision.map(m => (
          <div key={m.id} className={styles.listItem}>
            <div className={styles.listBody}>
              <h4 className={styles.listTitle}>{m.title}</h4>
              <p className={styles.listText}>{m.content}</p>
            </div>
            <div className={styles.listActions}>
              <button className={styles.iconBtn} onClick={() => openEdit(m)}><Pencil size={13} /></button>
              <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setDelTarget(m)}><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        <div className={styles.addListSlot} onClick={() => { setForm({ title: '', content: '' }); setAddOpen(true); }}><Plus size={18} /><span>Add Item</span></div>
      </div>
      <Modal open={addOpen || !!editItem} onClose={() => { setAddOpen(false); setEditItem(null); }} title={editItem ? 'Edit' : 'Add Mission/Vision'} size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Title"><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></Field>
          <Field label="Content"><Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4} /></Field>
        </div>
        <div className={styles.panelFooter}>
          <Btn variant="secondary" onClick={() => { setAddOpen(false); setEditItem(null); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}>{editItem ? 'Save' : 'Add'}</Btn>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDel} loading={deleting} title="Delete?" message={`Delete "${delTarget?.title}"?`} />
    </div>
  );
};

// ─── Milestones panel ────────────────────────────────────
const MilestonesPanel: React.FC = () => {
  const { milestones, setMilestones } = useAdminData();
  const { success, error } = useToast();
  const [editItem, setEditItem] = useState<Milestone | null>(null);
  const [form, setForm] = useState({ year: '', title: '', content: '' });
  const [addOpen, setAddOpen] = useState(false);
  const [delTarget, setDelTarget] = useState<Milestone | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openEdit = (m: Milestone) => { setForm({ year: m.year, title: m.title, content: m.content }); setEditItem(m); };
  const handleSave = async () => {
    setSaving(true);
    try {
      if (editItem) {
        await api.put.milestone(editItem.id, form);
        setMilestones(milestones.map(m => m.id === editItem.id ? { ...editItem, ...form } : m));
        success('Updated'); setEditItem(null);
      } else {
        await api.post.milestone(form);
        setMilestones([...milestones, { id: Date.now(), ...form }]);
        success('Added'); setAddOpen(false);
      }
    } catch { error('Failed'); } finally { setSaving(false); }
  };
  const handleDel = async () => {
    if (!delTarget) return; setDeleting(true);
    try { await api.delete.milestone(delTarget.id); setMilestones(milestones.filter(m => m.id !== delTarget.id)); success('Deleted'); setDelTarget(null); }
    catch { error('Failed'); } finally { setDeleting(false); }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Club Milestones</h3>
        <Btn variant="secondary" onClick={() => { setForm({ year: '', title: '', content: '' }); setAddOpen(true); }}><Plus size={13} /> Add</Btn>
      </div>
      <div className={styles.listItems}>
        {milestones.map(m => (
          <div key={m.id} className={styles.listItem}>
            <div className={styles.milestoneYear}>{m.year}</div>
            <div className={styles.listBody}>
              <h4 className={styles.listTitle}>{m.title}</h4>
              <p className={styles.listText}>{m.content}</p>
            </div>
            <div className={styles.listActions}>
              <button className={styles.iconBtn} onClick={() => openEdit(m)}><Pencil size={13} /></button>
              <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setDelTarget(m)}><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
        <div className={styles.addListSlot} onClick={() => { setForm({ year: '', title: '', content: '' }); setAddOpen(true); }}><Plus size={18} /><span>Add Milestone</span></div>
      </div>
      <Modal open={addOpen || !!editItem} onClose={() => { setAddOpen(false); setEditItem(null); }} title={editItem ? 'Edit Milestone' : 'Add Milestone'} size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Year"><Input value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} placeholder="2024" /></Field>
          <Field label="Title"><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></Field>
          <Field label="Description"><Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={3} /></Field>
        </div>
        <div className={styles.panelFooter}>
          <Btn variant="secondary" onClick={() => { setAddOpen(false); setEditItem(null); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}>{editItem ? 'Save' : 'Add'}</Btn>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDel} loading={deleting} title="Delete Milestone?" message={`Delete "${delTarget?.title}"?`} />
    </div>
  );
};

// ─── Management panel ────────────────────────────────────
const ManagementPanel: React.FC = () => {
  const { management, setManagement } = useAdminData();
  const { success, error } = useToast();
  const [editItem, setEditItem] = useState<Management | null>(null);
  const [form, setForm] = useState({ name: '', role: '', image: '', blur_image: '' });
  const [addOpen, setAddOpen] = useState(false);
  const [delTarget, setDelTarget] = useState<Management | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openEdit = (m: Management) => { setForm({ name: m.name, role: m.role, image: m.image, blur_image: m.blur_image }); setEditItem(m); };
  const handleSave = async () => {
    setSaving(true);
    try {
      if (editItem) {
        await api.put.management(editItem.id, form);
        setManagement(management.map(m => m.id === editItem.id ? { ...editItem, ...form } : m));
        success('Updated'); setEditItem(null);
      } else {
        await api.post.management(form);
        setManagement([...management, { id: Date.now(), ...form }]);
        success('Added'); setAddOpen(false);
      }
    } catch { error('Failed'); } finally { setSaving(false); }
  };
  const handleDel = async () => {
    if (!delTarget) return; setDeleting(true);
    try { await api.delete.management(delTarget.id); setManagement(management.filter(m => m.id !== delTarget.id)); success('Deleted'); setDelTarget(null); }
    catch { error('Failed'); } finally { setDeleting(false); }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Club Management</h3>
        <Btn variant="secondary" onClick={() => { setForm({ name: '', role: '', image: '', blur_image: '' }); setAddOpen(true); }}><Plus size={13} /> Add</Btn>
      </div>
      <div className={styles.managementGrid}>
        {management.map(m => (
          <div key={m.id} className={styles.mgmtCard}>
            <div className={styles.mgmtImg}><img src={m.image} alt={m.name} /></div>
            <h4 className={styles.mgmtName}>{m.name}</h4>
            <span className={styles.mgmtRole}>{m.role}</span>
            <div className={styles.mgmtActions}>
              <button className={styles.iconBtn} onClick={() => openEdit(m)}><Pencil size={12} /></button>
              <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setDelTarget(m)}><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
        <div className={styles.mgmtAddSlot} onClick={() => { setForm({ name: '', role: '', image: '', blur_image: '' }); setAddOpen(true); }}><Plus size={24} /><span>Add Member</span></div>
      </div>
      <Modal open={addOpen || !!editItem} onClose={() => { setAddOpen(false); setEditItem(null); }} title={editItem ? 'Edit Person' : 'Add Management'} size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Full Name"><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></Field>
          <Field label="Role / Title"><Input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="Head Coach" /></Field>
          <Field label="Photo URL"><Input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." /></Field>
          <Field label="Blur Image URL"><Input value={form.blur_image} onChange={e => setForm(p => ({ ...p, blur_image: e.target.value }))} /></Field>
        </div>
        <div className={styles.panelFooter}>
          <Btn variant="secondary" onClick={() => { setAddOpen(false); setEditItem(null); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}>{editItem ? 'Save' : 'Add'}</Btn>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDel} loading={deleting} title="Remove Person?" message={`Remove ${delTarget?.name}?`} />
    </div>
  );
};

// ─── Main Settings page ──────────────────────────────────
const Settings: React.FC = () => {
  const sections = [
    { id: 'credentials', label: 'Credentials', icon: <Eye size={16} /> },
    { id: 'contact',     label: 'Contact & Socials', icon: <Globe size={16} /> },
    { id: 'stats',       label: 'Club Stats', icon: <Trophy size={16} /> },
    { id: 'mission',     label: 'Mission & Vision', icon: <BookOpen size={16} /> },
    { id: 'milestones',  label: 'Milestones', icon: <BookOpen size={16} /> },
    { id: 'management',  label: 'Management', icon: <Users size={16} /> },
  ];
  const [active, setActive] = useState('credentials');

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Settings</h1>
      <div className={styles.layout}>
        <aside className={styles.settingsNav}>
          {sections.map(s => (
            <button key={s.id} className={`${styles.navItem} ${active === s.id ? styles.navActive : ''}`} onClick={() => setActive(s.id)}>
              {s.icon} {s.label}
            </button>
          ))}
        </aside>
        <div className={styles.settingsContent}>
          {active === 'credentials' && <CredentialsPanel />}
          {active === 'contact'     && <SocialsPanel />}
          {active === 'stats'       && <StatsPanel />}
          {active === 'mission'     && <MissionPanel />}
          {active === 'milestones'  && <MilestonesPanel />}
          {active === 'management'  && <ManagementPanel />}
        </div>
      </div>
    </div>
  );
};

export default Settings;
