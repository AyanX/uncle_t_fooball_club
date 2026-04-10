// Settings/index.tsx — Credentials, Socials, Stats, Mission/Vision, Milestones, Management
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, Eye, EyeOff, Globe, Users, Trophy, BookOpen, Key, User, Mail, Lock } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import BlurImage from '@/components/ui/BlurImage';
import { ClubStat, MissionVisionItem, Milestone, Management } from '@/data/dummyData';
import { Field, Input, Textarea, Btn, ConfirmDialog, Modal } from '@/components/ui';
import ImageInput from '@/components/ui/ImageInput';
import { buildFormData } from '@/services/api';
import styles from './Settings.module.scss';

const CredentialsPanel: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useToast();

  // Username
  const [username, setUsername] = useState(user?.username || '');
  const [savingUser, setSavingUser] = useState(false);

  // Email
  const [email, setEmail] = useState(user?.email || '');
  const [savingEmail, setSavingEmail] = useState(false);

  // Password
  const [current, setCurrent]   = useState('');
  const [newPass, setNewPass]   = useState('');
  const [repeat, setRepeat]     = useState('');
  const [showCur, setShowCur]   = useState(false);
  const [showNew, setShowNew]   = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  // PIN
  const [pin, setPin]           = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [savingPin, setSavingPin]   = useState(false);

  // Fetch profile on mount to get username
  useEffect(() => {
    api.auth.getProfile().then((p: any) => {
      if (p?.username) setUsername(p.username);
      if (p?.email) setEmail(p.email);
    });
  }, []);

  const saveUsername = async () => {
    if (!username.trim()) { error('Username cannot be empty'); return; }
    setSavingUser(true);
    try {
      const res = await api.auth.updateUsername(username.trim());
      updateUser({ username: res.data.data.username });
      success(res.data.message || 'Username updated');
    } catch { error('Failed to update username'); } finally { setSavingUser(false); }
  };

  const saveEmail = async () => {
    if (!email.trim() || !email.includes('@')) { error('Enter a valid email address'); return; }
    setSavingEmail(true);
    try {
      const res = await api.auth.updateEmail(email.trim());
      updateUser({ email: res.data.data.email });
      success(res.data.message || 'Email updated');
    } catch { error('Failed to update email'); } finally { setSavingEmail(false); }
  };

  const savePassword = async () => {
    if (!current) { error('Current password is required'); return; }
    if (!newPass)  { error('New password cannot be empty'); return; }
    if (newPass !== repeat) { error('Passwords do not match'); return; }
    if (newPass.length < 6) { error('Password must be at least 6 characters'); return; }
    setSavingPass(true);
    try {
      const res = await api.auth.updatePassword({ current_password: current, new_password: newPass });
      success(res.data.message || 'Password updated');
      setCurrent(''); setNewPass(''); setRepeat('');
    } catch { error('Failed to update password'); } finally { setSavingPass(false); }
  };

  const savePin = async () => {
    const trimPin = pin.trim();
    if (!/^\d{4,8}$/.test(trimPin)) { error('PIN must be 4–8 digits'); return; }
    if (trimPin !== confirmPin.trim()) { error('PINs do not match'); return; }
    setSavingPin(true);
    try {
      const res = await api.auth.updatePin({ pin: trimPin, confirm_pin: confirmPin.trim() });
      success(res.data.message || 'PIN updated');
      setPin(''); setConfirmPin('');
    } catch { error('Failed to update PIN'); } finally { setSavingPin(false); }
  };

  return (
    <div className={styles.credsGrid}>
      {/* Username */}
      <div className={styles.credCard}>
        <div className={styles.credHeader}><User size={16} className={styles.credIcon} /><h4 className={styles.credTitle}>Username</h4></div>
        <p className={styles.credDesc}>Displayed in the admin navbar and sidebar</p>
        <Field label="Username">
          <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" />
        </Field>
        <div className={styles.credFooter}>
          <Btn loading={savingUser} onClick={saveUsername}><Save size={13} /> Save Username</Btn>
        </div>
      </div>

      {/* Email */}
      <div className={styles.credCard}>
        <div className={styles.credHeader}><Mail size={16} className={styles.credIcon} /><h4 className={styles.credTitle}>Email Address</h4></div>
        <p className={styles.credDesc}>Used for admin login and notifications</p>
        <Field label="Email">
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@Uncle T-fc.com" />
        </Field>
        <div className={styles.credFooter}>
          <Btn loading={savingEmail} onClick={saveEmail}><Save size={13} /> Save Email</Btn>
        </div>
      </div>

      {/* Password */}
      <div className={styles.credCard}>
        <div className={styles.credHeader}><Lock size={16} className={styles.credIcon} /><h4 className={styles.credTitle}>Password</h4></div>
        <p className={styles.credDesc}>Minimum 6 characters. Current password required.</p>
        <div className={styles.passFields}>
          <Field label="Current Password">
            <div className={styles.passWrap}>
              <Input type={showCur ? 'text' : 'password'} value={current} onChange={e => setCurrent(e.target.value)} placeholder="Current password" />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowCur(v => !v)}>{showCur ? <EyeOff size={14}/> : <Eye size={14}/>}</button>
            </div>
          </Field>
          <Field label="New Password">
            <div className={styles.passWrap}>
              <Input type={showNew ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="New password" />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowNew(v => !v)}>{showNew ? <EyeOff size={14}/> : <Eye size={14}/>}</button>
            </div>
          </Field>
          <Field label="Confirm New Password">
            <Input type="password" value={repeat} onChange={e => setRepeat(e.target.value)} placeholder="Repeat new password" />
          </Field>
        </div>
        <div className={styles.credFooter}>
          <Btn loading={savingPass} onClick={savePassword}><Save size={13} /> Update Password</Btn>
        </div>
      </div>

      {/* PIN */}
      <div className={styles.credCard}>
        <div className={styles.credHeader}><Key size={16} className={styles.credIcon} /><h4 className={styles.credTitle}>Security PIN</h4></div>
        <p className={styles.credDesc}>4–8 digit numeric PIN for quick actions</p>
        <div className={styles.passFields}>
          <Field label="New PIN">
            <Input
              type="password" inputMode="numeric" value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="4–8 digits" maxLength={8}
            />
          </Field>
          <Field label="Confirm PIN">
            <Input
              type="password" inputMode="numeric" value={confirmPin}
              onChange={e => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="Repeat PIN" maxLength={8}
            />
          </Field>
        </div>
        <div className={styles.credFooter}>
          <Btn loading={savingPin} onClick={savePin}><Save size={13} /> Set PIN</Btn>
        </div>
      </div>
    </div>
  );
};


const LogoPanel: React.FC = () => {
  const { logo, setLogo } = useAdminData();
  const { success, error } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving]       = useState(false);
  const [loaded, setLoaded]       = useState(false);

  const handleSave = async () => {
    if (!imageFile) { error('Please select an image'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('image', imageFile);
      const res = await api.put.logo(fd);
      const data = res.data?.data ?? res.data;
      const updated = { image: data.image || '', blur_image: data.blur_image || '' };
      setLogo(updated);
      setImageFile(null);
      success(res.data?.message || 'Logo updated');
    } catch { error('Failed to update logo'); }
    finally { setSaving(false); }
  };

  return (
    <div className={styles.credCard} style={{ gridColumn: '1/-1' }}>
      <div className={styles.credHeader}>
        <div style={{ width: 16, height: 16, background: '#C8102E', borderRadius: 4 }} />
        <h4 className={styles.credTitle}>Club Logo</h4>
      </div>
      <p className={styles.credDesc}>Shown in the admin sidebar, topbar, and client navbar.</p>
      {logo?.image && !imageFile && (
        <div style={{ position: 'relative', width: 80, height: 80, borderRadius: 12, overflow: 'hidden', border: '1.5px solid rgba(10,20,47,0.1)', marginBottom: 8 }}>
          {logo.blur_image && (
            <img src={logo.blur_image} aria-hidden alt=""
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', filter: 'blur(10px)', transform: 'scale(1.1)', opacity: loaded ? 0 : 1, transition: 'opacity 0.4s', pointerEvents: 'none' }}
            />
          )}
          <img src={logo.image} alt="Current logo" onLoad={() => setLoaded(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: loaded ? 1 : 0, transition: 'opacity 0.4s' }}
          />
        </div>
      )}
      <div style={{ maxWidth: 160 }}>
        <ImageInput
          currentUrl={logo?.image || undefined}
          blurUrl={logo?.blur_image || undefined}
          onFileChange={setImageFile}
          label="Upload New Logo"
          aspectRatio="1/1"
        />
      </div>
      <div className={styles.credFooter}>
        <Btn loading={saving} onClick={handleSave} disabled={!imageFile}>
          <Save size={13} /> Save Logo
        </Btn>
      </div>
    </div>
  );
};

const SocialsPanel: React.FC = () => {
  const { socials, setSocials, teamname, setTeamname, logo, setLogo } = useAdminData();
  const [clubName, setClubName] = useState(teamname);
  const [savingClub, setSavingClub] = useState(false);
  React.useEffect(() => { setClubName(teamname); }, [teamname]);
  const { success, error } = useToast();
  const [form, setForm] = useState({ ...socials });
  const [saving, setSaving] = useState(false);
  useEffect(() => { setForm({ ...socials }); }, [socials]);
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.put.socials(form);
      setSocials(res.data?.data ?? form);
      success(res.data?.message || 'Contact info updated');
    } catch { error('Failed to save contact info'); } finally { setSaving(false); }
  };

  const leftFields: [string, string, string][] = [
    ['address',      'Address',        'National Main Stadium, Dar es Salaam'],
    ['phone_number', 'Phone Number',   '+255 123 456 789'],
    ['email',        'Email Address',  'info@Uncle T-fc.com'],
    ['location',     'Location',       'Dar es Salaam, Tanzania'],
    ['open_day',     'Opening Day',    'Mon'],
    ['close_day',    'Closing Day',    'Fri'],
    ['open_hours',   'Opening Hours',  '8:00'],
    ['close_hours',  'Closing Hours',  '17:00'],
  ];
  const socialFields: [string, string][] = [
    ['twitter','Twitter URL'],['facebook','Facebook URL'],
    ['instagram','Instagram URL'],['youtube','YouTube URL'],
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.panelTitleRow}><Globe size={16}/><h3 className={styles.panelTitle}>Contact & Social Info</h3></div>
      {/* Club Name */}
      <div className={styles.clubNameRow}>
        <div style={{flex:1}}>
          <Field label="Club Name">
            <Input value={clubName} onChange={e => setClubName(e.target.value)} placeholder="Uncle T FC"/>
          </Field>
          <p style={{fontFamily:'Inter,sans-serif',fontSize:12,color:'#718096',marginTop:6}}>Used in fixtures to identify your team for wins/losses tracking</p>
        </div>
        <div style={{flexShrink:0,marginTop:24}}>
          <Btn loading={savingClub} onClick={async () => {
            if (!clubName.trim()) return;
            setSavingClub(true);
            try {
              const res = await api.put.teamname({ name: clubName.trim() });
              setTeamname(clubName.trim());
              success(res.data?.message || 'Club name updated');
            } catch { error('Failed to update club name'); }
            finally { setSavingClub(false); }
          }}><Save size={13}/> Save Club Name</Btn>
        </div>
      </div>
      <div className={styles.fullGrid}>
        {leftFields.map(([k,label,ph]) => (
          <Field key={k} label={label}>
            <Input value={(form as any)[k]||''} onChange={e=>set(k,e.target.value)} placeholder={ph}/>
          </Field>
        ))}
        {socialFields.map(([k,label]) => (
          <Field key={k} label={label}>
            <Input value={(form as any)[k]||''} onChange={e=>set(k,e.target.value)} placeholder={`https://...`}/>
          </Field>
        ))}
      </div>
      <div className={styles.panelFooter}><Btn loading={saving} onClick={save}><Save size={14}/> Save Contact Info</Btn></div>
    </div>
  );
};

const StatsPanel: React.FC = () => {
  const { stats, setStats } = useAdminData();
  const { success, error } = useToast();
  const [editItem, setEditItem] = useState<ClubStat|null>(null);
  const [form, setForm] = useState({ label:'', value:'', icon:'Trophy' });
  const [addOpen, setAddOpen] = useState(false);
  const [delTarget, setDelTarget] = useState<ClubStat|null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const ICONS = ['Trophy','Calendar','Users','Globe','Star','Target'];

  const openEdit = (s: ClubStat) => { setForm({ label:s.label, value:s.value, icon:s.icon }); setEditItem(s); };
  const handleSave = async () => {
    if (!form.label || !form.value) { error('Label and value are required'); return; }
    setSaving(true);
    try {
      if (editItem) {
        const res = await api.put.stat(editItem.id, form);
        const updated = res.data?.data ?? { ...editItem, ...form };
        setStats(stats.map(s => s.id === editItem.id ? updated : s));
        success(res.data?.message || 'Stat updated'); setEditItem(null);
      } else {
        const res = await api.post.stat(form);
        const created = res.data?.data ?? { id: Date.now(), ...form };
        setStats([...stats, created]);
        success(res.data?.message || 'Stat added'); setAddOpen(false);
      }
    } catch { error('Failed to save stat'); } finally { setSaving(false); }
  };
  const handleDel = async () => {
    if (!delTarget) return;
    setDeleting(true);
    setDelTarget(null);
    try {
      const res = await api.delete.stat(delTarget.id);
      setStats(stats.filter(s => s.id !== delTarget.id));
      success((res as any)?.data?.message || 'Stat deleted');
    } catch { error('Failed to delete stat'); } finally { setDeleting(false); }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeaderRow}>
        <div className={styles.panelTitleRow}><Trophy size={16}/><h3 className={styles.panelTitle}>Club Statistics</h3></div>
        <Btn variant="secondary" onClick={() => { setForm({ label:'', value:'', icon:'Trophy' }); setAddOpen(true); }}><Plus size={13}/> Add Stat</Btn>
      </div>
      <div className={styles.statsGrid}>
        {stats.map(s => (
          <div key={s.id} className={styles.statCard}>
            <span className={styles.statVal}>{s.value}</span>
            <span className={styles.statLbl}>{s.label}</span>
            <div className={styles.alwaysActions}>
              <button className={styles.iconBtn} onClick={() => openEdit(s)}><Pencil size={12}/></button>
              <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setDelTarget(s)}><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
        <div className={styles.addSlotCard} onClick={() => { setForm({ label:'', value:'', icon:'Trophy' }); setAddOpen(true); }}><Plus size={20}/></div>
      </div>
      <Modal open={addOpen || !!editItem} onClose={() => { setAddOpen(false); setEditItem(null); }} title={editItem ? 'Edit Stat' : 'Add Stat'} size="sm">
        <div className={styles.formGrid2}>
          <Field label="Label"><Input value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="League Titles"/></Field>
          <Field label="Value"><Input value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} placeholder="8"/></Field>
        </div>
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => { setAddOpen(false); setEditItem(null); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}>{editItem ? 'Save' : 'Add'}</Btn>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDel} loading={deleting} title="Delete Stat?" message={`Delete "${delTarget?.label}"?`}/>
    </div>
  );
};

const MissionPanel: React.FC = () => {
  const { missionVision, setMissionVision } = useAdminData();
  const { success, error } = useToast();
  const [editItem, setEditItem] = useState<MissionVisionItem|null>(null);
  const [form, setForm] = useState({ title:'', content:'' });
  const [saving, setSaving] = useState(false);

  const openEdit = (m: MissionVisionItem) => { setForm({ title:m.title, content:m.content }); setEditItem(m); };
  const handleSave = async () => {
    if (!editItem) return;
    setSaving(true);
    try {
      const res = await api.put.missionVision(editItem.id, form);
      const updated = res.data?.data ?? { ...editItem, ...form };
      setMissionVision(missionVision.map(m => m.id === editItem.id ? updated : m));
      success(res.data?.message || 'Updated'); setEditItem(null);
    } catch { error('Failed to save'); } finally { setSaving(false); }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelTitleRow}><BookOpen size={16}/><h3 className={styles.panelTitle}>Mission & Vision</h3></div>
      <p className={styles.panelDesc}>These 2 entries are fixed. You can only edit their content.</p>
      <div className={styles.listItems}>
        {missionVision.map(m => (
          <div key={m.id} className={styles.listItem}>
            <div className={styles.listBody}>
              <h4 className={styles.listTitle}>{m.title}</h4>
              <p className={styles.listText}>{m.content}</p>
            </div>
            <div className={styles.alwaysActions}>
              <button className={styles.iconBtn} onClick={() => openEdit(m)}><Pencil size={13}/></button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Mission/Vision" size="sm">
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Field label="Title"><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}/></Field>
          <Field label="Content"><Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4}/></Field>
        </div>
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => setEditItem(null)}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}>Save Changes</Btn>
        </div>
      </Modal>
    </div>
  );
};

const MilestonesPanel: React.FC = () => {
  const { milestones, setMilestones } = useAdminData();
  const { success, error } = useToast();
  const [editItem, setEditItem] = useState<Milestone|null>(null);
  const [form, setForm] = useState({ year:'', title:'', content:'' });
  const [addOpen, setAddOpen] = useState(false);
  const [delTarget, setDelTarget] = useState<Milestone|null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openEdit = (m: Milestone) => { setForm({ year:m.year, title:m.title, content:m.content }); setEditItem(m); };
  const handleSave = async () => {
    if (!form.year || !form.title) { error('Year and title required'); return; }
    setSaving(true);
    try {
      if (editItem) {
        const res = await api.put.milestone(editItem.id, form);
        const updated = res.data?.data ?? { ...editItem, ...form };
        setMilestones(milestones.map(m => m.id === editItem.id ? updated : m));
        success(res.data?.message || 'Milestone updated'); setEditItem(null);
      } else {
        const res = await api.post.milestone(form);
        const created = res.data?.data ?? { id: Date.now(), ...form };
        setMilestones([...milestones, created]);
        success(res.data?.message || 'Milestone added'); setAddOpen(false);
      }
    } catch { error('Failed'); } finally { setSaving(false); }
  };
  const handleDel = async () => {
    if (!delTarget) return;
    setDeleting(true);
    setDelTarget(null);
    try {
      const res = await api.delete.milestone(delTarget.id);
      setMilestones(milestones.filter(m => m.id !== delTarget.id));
      success((res as any)?.data?.message || 'Deleted');
    } catch { error('Failed to delete'); } finally { setDeleting(false); }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeaderRow}>
        <div className={styles.panelTitleRow}><BookOpen size={16}/><h3 className={styles.panelTitle}>Club Milestones</h3></div>
        <Btn variant="secondary" onClick={() => { setForm({ year:'', title:'', content:'' }); setAddOpen(true); }}><Plus size={13}/> Add Milestone</Btn>
      </div>
      <div className={styles.listItems}>
        {milestones.map(m => (
          <div key={m.id} className={styles.listItem}>
            <div className={styles.milestoneYear}>{m.year}</div>
            <div className={styles.listBody}>
              <h4 className={styles.listTitle}>{m.title}</h4>
              <p className={styles.listText}>{m.content}</p>
            </div>
            <div className={styles.alwaysActions}>
              <button className={styles.iconBtn} onClick={() => openEdit(m)}><Pencil size={13}/></button>
              <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setDelTarget(m)}><Trash2 size={13}/></button>
            </div>
          </div>
        ))}
        <div className={styles.addListSlot} onClick={() => { setForm({ year:'', title:'', content:'' }); setAddOpen(true); }}><Plus size={18}/><span>Add Milestone</span></div>
      </div>
      <Modal open={addOpen || !!editItem} onClose={() => { setAddOpen(false); setEditItem(null); }} title={editItem ? 'Edit Milestone' : 'Add Milestone'} size="sm">
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Field label="Year"><Input value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} placeholder="2024"/></Field>
          <Field label="Title"><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}/></Field>
          <Field label="Description"><Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={3}/></Field>
        </div>
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => { setAddOpen(false); setEditItem(null); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}>{editItem ? 'Save' : 'Add'}</Btn>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDel} loading={deleting} title="Delete Milestone?" message={`Delete "${delTarget?.title}"?`}/>
    </div>
  );
};

const ManagementPanel: React.FC = () => {
  const { management, setManagement } = useAdminData();
  const { success, error } = useToast();
  const [editItem, setEditItem] = useState<Management|null>(null);
  const [form, setForm] = useState({ name:'', role:'', image:'' });
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [delTarget, setDelTarget] = useState<Management|null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openEdit = (m: Management) => { setForm({ name:m.name, role:m.role, image:m.image }); setImageFile(null); setEditItem(m); };
  const handleSave = async () => {
    if (!form.name || !form.role) { error('Name and role required'); return; }
    setSaving(true);
    try {
      const payload = buildFormData({ name:form.name, role:form.role, image:form.image }, imageFile);
      if (editItem) {
        const res = await api.put.management(editItem.id, payload);
        const updated = res.data?.data ?? { ...editItem, ...form };
        setManagement(management.map(m => m.id === editItem.id ? updated : m));
        success(res.data?.message || 'Updated'); setEditItem(null);
      } else {
        const res = await api.post.management(payload);
        const created = res.data?.data ?? { id: Date.now(), ...form, blur_image:'' };
        setManagement([...management, created]);
        success(res.data?.message || 'Added'); setAddOpen(false);
      }
    } catch { error('Failed'); } finally { setSaving(false); }
  };
  const handleDel = async () => {
    if (!delTarget) return;
    setDeleting(true);
    setDelTarget(null);
    try {
      const res = await api.delete.management(delTarget.id);
      setManagement(management.filter(m => m.id !== delTarget.id));
      success((res as any)?.data?.message || 'Deleted');
    } catch { error('Failed to delete'); } finally { setDeleting(false); }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeaderRow}>
        <div className={styles.panelTitleRow}><Users size={16}/><h3 className={styles.panelTitle}>Club Management</h3></div>
        <Btn variant="secondary" onClick={() => { setForm({ name:'', role:'', image:'' }); setImageFile(null); setAddOpen(true); }}><Plus size={13}/> Add Person</Btn>
      </div>
      <div className={styles.mgmtGrid}>
        {management.map(m => (
          <div key={m.id} className={styles.mgmtCard}>
            <div className={styles.mgmtImg}>{m.image && <BlurImage src={m.image} blurSrc={m.blur_image||undefined} alt={m.name}/>}</div>
            <h4 className={styles.mgmtName}>{m.name}</h4>
            <span className={styles.mgmtRole}>{m.role}</span>
            <div className={styles.alwaysActions}>
              <button className={styles.iconBtn} onClick={() => openEdit(m)}><Pencil size={12}/></button>
              <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setDelTarget(m)}><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
        <div className={styles.mgmtAddSlot} onClick={() => { setForm({ name:'', role:'', image:'' }); setImageFile(null); setAddOpen(true); }}>
          <Plus size={24}/><span>Add Member</span>
        </div>
      </div>
      <Modal open={addOpen || !!editItem} onClose={() => { setAddOpen(false); setEditItem(null); }} title={editItem ? 'Edit Person' : 'Add Management'} size="sm">
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <ImageInput currentUrl={editItem?.image || undefined} onFileChange={setImageFile} label="Photo" aspectRatio="1/1"/>
          <Field label="Full Name"><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}/></Field>
          <Field label="Role / Title"><Input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="Head Coach"/></Field>
        </div>
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => { setAddOpen(false); setEditItem(null); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}>{editItem ? 'Save' : 'Add'}</Btn>
        </div>
      </Modal>
      <ConfirmDialog open={!!delTarget} onClose={() => setDelTarget(null)} onConfirm={handleDel} loading={deleting} title="Remove Person?" message={`Remove ${delTarget?.name}?`}/>
    </div>
  );
};

const TABS = [
  { id: 'logo',        label: 'Logo',        icon: <Key size={15}/> },
  { id: 'credentials', label: 'Credentials', icon: <Key size={15}/> },
  { id: 'contact',     label: 'Contact & Socials', icon: <Globe size={15}/> },
  { id: 'stats',       label: 'Club Stats', icon: <Trophy size={15}/> },
  { id: 'mission',     label: 'Mission & Vision', icon: <BookOpen size={15}/> },
  { id: 'milestones',  label: 'Milestones', icon: <BookOpen size={15}/> },
  { id: 'management',  label: 'Management', icon: <Users size={15}/> },
];

const Settings: React.FC = () => {
  const [active, setActive] = useState('credentials');
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Settings</h1>
      {/* Horizontal tab bar */}
      <div className={styles.tabBar}>
        {TABS.map(t => (
          <button key={t.id} className={`${styles.tab} ${active === t.id ? styles.tabActive : ''}`} onClick={() => setActive(t.id)}>
            {t.icon}<span>{t.label}</span>
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {active === 'logo'        && <div className={styles.credsGrid}><LogoPanel/></div>}
        {active === 'credentials' && <CredentialsPanel/>}
        {active === 'contact'     && <SocialsPanel/>}
        {active === 'stats'       && <StatsPanel/>}
        {active === 'mission'     && <MissionPanel/>}
        {active === 'milestones'  && <MilestonesPanel/>}
        {active === 'management'  && <ManagementPanel/>}
      </div>
    </div>
  );
};

export default Settings;
