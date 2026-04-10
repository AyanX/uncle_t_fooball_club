import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Check, X, AlertCircle, BookOpen, Tag } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useToast } from '@/context/ToastContext';
import { api, buildFormData } from '@/services/api';
import { Program, ProgramTitle } from '@/data/dummyData';
import { Modal, ConfirmDialog, Field, Input, Select, Textarea, Btn } from '@/components/ui';
import ImageInput from '@/components/ui/ImageInput';
import BlurImage from '@/components/ui/BlurImage';
import styles from './Programs.module.scss';

const toSlug = (t: string) =>
  t.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80);

type PF = {
  title: string; slug: string; tagline: string;
  description: string; longDescription: string;
  image: string; color: string;
  stats: { label: string; value: string }[];
  highlights: string[];
};

const emptyPF: PF = {
  title: '', slug: '', tagline: '', description: '', longDescription: '',
  image: '', color: '#C8102E', stats: [], highlights: [],
};

const EditableList: React.FC<{
  items: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  label: string;
}> = ({ items, onChange, placeholder, label }) => {
  const [ei, setEi]       = useState<number | null>(null);
  const [ev, setEv]       = useState('');
  const [nv, setNv]       = useState('');
  const [adding, setAdding] = useState(false);

  return (
    <div className={styles.editableList}>
      <span className={styles.editableListLabel}>{label}</span>
      <div className={styles.listItems}>
        {items.map((item, i) => (
          <div key={i} className={styles.listRow}>
            {ei === i ? (
              <div className={styles.listEditRow}>
                <input className={styles.listEditInput} value={ev}
                  onChange={e => setEv(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { const n = [...items]; n[i] = ev; onChange(n); setEi(null); }
                    if (e.key === 'Escape') setEi(null);
                  }}
                  autoFocus />
                <button className={styles.listSaveBtn} onClick={() => { const n = [...items]; n[i] = ev; onChange(n); setEi(null); }}><Check size={14} /></button>
                <button className={styles.listCancelBtn} onClick={() => setEi(null)}><X size={14} /></button>
              </div>
            ) : (
              <>
                <span className={styles.listItemText}>{item}</span>
                <div className={styles.listItemActions}>
                  <button className={styles.listActionBtn} onClick={() => { setEi(i); setEv(item); }}><Pencil size={12} /></button>
                  <button className={`${styles.listActionBtn} ${styles.danger}`} onClick={() => onChange(items.filter((_, j) => j !== i))}><Trash2 size={12} /></button>
                </div>
              </>
            )}
          </div>
        ))}
        {adding ? (
          <div className={styles.listEditRow}>
            <input className={styles.listEditInput} value={nv}
              onChange={e => setNv(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') { if (nv.trim()) { onChange([...items, nv.trim()]); setNv(''); setAdding(false); } }
                if (e.key === 'Escape') setAdding(false);
              }}
              placeholder={placeholder} autoFocus />
            <button className={styles.listSaveBtn} onClick={() => { if (nv.trim()) { onChange([...items, nv.trim()]); setNv(''); setAdding(false); } }}><Check size={14} /></button>
            <button className={styles.listCancelBtn} onClick={() => setAdding(false)}><X size={14} /></button>
          </div>
        ) : (
          <button className={styles.listAddBtn} onClick={() => setAdding(true)}>
            <Plus size={14} /> Add {label}
          </button>
        )}
      </div>
    </div>
  );
};

const EditableStatList: React.FC<{
  stats: { label: string; value: string }[];
  onChange: (v: { label: string; value: string }[]) => void;
}> = ({ stats, onChange }) => {
  const [ei, setEi]       = useState<number | null>(null);
  const [el, setEl]       = useState('');
  const [ev, setEv]       = useState('');
  const [adding, setAdding] = useState(false);
  const [nl, setNl]       = useState('');
  const [nv, setNv]       = useState('');

  const save = () => {
    if (ei === null) return;
    const n = [...stats]; n[ei] = { label: el, value: ev }; onChange(n); setEi(null);
  };

  return (
    <div className={styles.editableList}>
      <span className={styles.editableListLabel}>Stats</span>
      <div className={styles.listItems}>
        {stats.map((s, i) => (
          <div key={i} className={styles.listRow}>
            {ei === i ? (
              <div className={styles.statEditRow}>
                <input className={styles.listEditInput} value={el} onChange={e => setEl(e.target.value)} placeholder="Label" autoFocus />
                <input className={styles.listEditInput} value={ev} onChange={e => setEv(e.target.value)} placeholder="Value"
                  onKeyDown={e => { if (e.key === 'Enter') save(); }} />
                <button className={styles.listSaveBtn} onClick={save}><Check size={14} /></button>
                <button className={styles.listCancelBtn} onClick={() => setEi(null)}><X size={14} /></button>
              </div>
            ) : (
              <>
                <div className={styles.statDisplay}>
                  <span className={styles.statVal}>{s.value}</span>
                  <span className={styles.statLblSmall}>{s.label}</span>
                </div>
                <div className={styles.listItemActions}>
                  <button className={styles.listActionBtn} onClick={() => { setEi(i); setEl(s.label); setEv(s.value); }}><Pencil size={12} /></button>
                  <button className={`${styles.listActionBtn} ${styles.danger}`} onClick={() => onChange(stats.filter((_, j) => j !== i))}><Trash2 size={12} /></button>
                </div>
              </>
            )}
          </div>
        ))}
        {adding ? (
          <div className={styles.statEditRow}>
            <input className={styles.listEditInput} value={nl} onChange={e => setNl(e.target.value)} placeholder="Label (e.g. Youth Players)" autoFocus />
            <input className={styles.listEditInput} value={nv} onChange={e => setNv(e.target.value)} placeholder="Value (e.g. 1,200+)"
              onKeyDown={e => { if (e.key === 'Enter') { if (nl.trim() && nv.trim()) { onChange([...stats, { label: nl.trim(), value: nv.trim() }]); setNl(''); setNv(''); setAdding(false); } } }} />
            <button className={styles.listSaveBtn} onClick={() => { if (nl.trim() && nv.trim()) { onChange([...stats, { label: nl.trim(), value: nv.trim() }]); setNl(''); setNv(''); setAdding(false); } }}><Check size={14} /></button>
            <button className={styles.listCancelBtn} onClick={() => setAdding(false)}><X size={14} /></button>
          </div>
        ) : (
          <button className={styles.listAddBtn} onClick={() => setAdding(true)}>
            <Plus size={14} /> Add Stat
          </button>
        )}
      </div>
    </div>
  );
};

const ProgramForm: React.FC<{
  value: PF;
  imageFile: File | null;
  onImageChange: (f: File | null) => void;
  onChange: (v: PF) => void;
  isEdit: boolean;
  availableTitles: ProgramTitle[];   // titles NOT already in use by another programme
}> = ({ value, imageFile, onImageChange, onChange, isEdit, availableTitles }) => {
  const set = (k: keyof PF, v: any) => onChange({ ...value, [k]: v });

  const handleTitleChange = (title: string) => {
    onChange({ ...value, title, slug: toSlug(title) });
  };

  return (
    <div className={styles.formGrid}>
      <div style={{ gridColumn: '1/-1' }}>
        <ImageInput
          currentUrl={isEdit ? value.image || undefined : undefined}
          onFileChange={onImageChange}
          label="Programme Image"
          required
          aspectRatio="16/9"
        />
      </div>

      {/* Title — dropdown of available (unused) titles */}
      <Field label="Programme Title" required>
        {availableTitles.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(200,16,46,0.05)', border: '1.5px solid rgba(200,16,46,0.2)', borderRadius: 8 }}>
            <AlertCircle size={15} color="#C8102E" />
            <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#C8102E' }}>
              No available titles. Please create a programme title first (bottom of this page).
            </span>
          </div>
        ) : (
          <Select value={value.title} onChange={e => handleTitleChange(e.target.value)}>
            <option value="">Select a programme title…</option>
            {availableTitles.map(t => (
              <option key={t.id} value={t.title}>{t.title}</option>
            ))}
          </Select>
        )}
      </Field>

      <Field label="Tagline">
        <Input value={value.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Developing the Stars of Tomorrow" />
      </Field>

      <Field label="Accent Colour">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="color" value={value.color} onChange={e => set('color', e.target.value)}
            style={{ width: 44, height: 44, padding: '4px 6px', cursor: 'pointer', borderRadius: 8, border: '2px solid rgba(10,20,47,0.1)', background: '#F8F9FA' }} />
          <Input value={value.color} onChange={e => set('color', e.target.value)} placeholder="#C8102E" style={{ flex: 1 }} />
        </div>
      </Field>

      <div style={{ gridColumn: '1/-1' }}>
        <Field label="Short Description">
          <Textarea value={value.description} onChange={e => set('description', e.target.value)} rows={2}
            placeholder="Brief description for the card" />
        </Field>
      </div>
      <div style={{ gridColumn: '1/-1' }}>
        <Field label="Full Description">
          <Textarea value={value.longDescription} onChange={e => set('longDescription', e.target.value)} rows={4}
            placeholder="Full programme description…" />
        </Field>
      </div>
      <div style={{ gridColumn: '1/-1' }}>
        <EditableStatList stats={value.stats} onChange={v => set('stats', v)} />
      </div>
      <div style={{ gridColumn: '1/-1' }}>
        <EditableList items={value.highlights} onChange={v => set('highlights', v)}
          placeholder="e.g. Full-season programmes for ages 8–18"
          label="Highlight" />
      </div>
    </div>
  );
};

const TitleManager: React.FC<{
  titles: ProgramTitle[];
  usedTitles: string[];
  onSave: (id: number | null, name: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}> = ({ titles, usedTitles, onSave, onDelete }) => {
  const [editId, setEditId]     = useState<number | null>(null);
  const [editVal, setEditVal]   = useState('');
  const [newVal, setNewVal]     = useState('');
  const [adding, setAdding]     = useState(false);
  const [delTarget, setDelTarget] = useState<ProgramTitle | null>(null);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async (id: number | null, val: string) => {
    if (!val.trim()) return;
    setSaving(true);
    await onSave(id, val.trim());
    setSaving(false);
    setEditId(null);
    setAdding(false);
    setNewVal('');
  };

  const handleDelete = async () => {
    if (!delTarget) return;
    setDeleting(true);
    setDelTarget(null);
    await onDelete(delTarget.id);
    setDeleting(false);
  };

  return (
    <div className={styles.titlesSection}>
      <div className={styles.titlesHead}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BookOpen size={16} color="#C8102E" />
          <span className={styles.titlesLabel}>Programme Titles</span>
          <span style={{ fontSize: 12, fontFamily: 'Inter,sans-serif', color: '#718096' }}>
            (dropdown options when creating/editing programmes)
          </span>
        </div>
        <Btn variant="secondary" onClick={() => setAdding(true)}><Plus size={13} /> Add Title</Btn>
      </div>

      <div className={styles.titlesList}>
        {titles.map(t => (
          <div key={t.id} className={`${styles.titleChip} ${usedTitles.includes(t.title) ? styles.titleInUse : ''}`}>
            {editId === t.id ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  className={styles.titleEditInput}
                  value={editVal}
                  onChange={e => setEditVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSave(t.id, editVal); if (e.key === 'Escape') setEditId(null); }}
                  autoFocus
                />
                <button className={styles.listSaveBtn} onClick={() => handleSave(t.id, editVal)} disabled={saving}><Check size={12} /></button>
                <button className={styles.listCancelBtn} onClick={() => setEditId(null)}><X size={12} /></button>
              </div>
            ) : (
              <>
                <Tag size={11} />
                <span>{t.title}</span>
                {usedTitles.includes(t.title) && (
                  <span className={styles.inUseBadge}>In Use</span>
                )}
                <button className={styles.chipBtn} onClick={() => { setEditId(t.id); setEditVal(t.title); }}><Pencil size={11} /></button>
                <button className={`${styles.chipBtn} ${styles.danger}`} onClick={() => setDelTarget(t)}><Trash2 size={11} /></button>
              </>
            )}
          </div>
        ))}

        {adding ? (
          <div className={styles.titleAddRow}>
            <input
              className={styles.titleEditInput}
              value={newVal}
              onChange={e => setNewVal(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(null, newVal); if (e.key === 'Escape') { setAdding(false); setNewVal(''); } }}
              placeholder="e.g. Sports Academy"
              autoFocus
            />
            <button className={styles.listSaveBtn} onClick={() => handleSave(null, newVal)} disabled={saving}><Check size={12} /></button>
            <button className={styles.listCancelBtn} onClick={() => { setAdding(false); setNewVal(''); }}><X size={12} /></button>
          </div>
        ) : (
          <div className={styles.titleAddChip} onClick={() => setAdding(true)}>
            <Plus size={14} /> Add Title
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!delTarget} onClose={() => setDelTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Title?"
        message={`Delete "${delTarget?.title}"?${usedTitles.includes(delTarget?.title || '') ? ' This title is currently in use by a programme.' : ''}`}
      />
    </div>
  );
};

const Programs: React.FC = () => {
  const { programs, programTitles, setPrograms, setProgramTitles, loading } = useAdminData();
  const { success, error } = useToast();

  const [addOpen, setAddOpen]         = useState(false);
  const [editItem, setEditItem]       = useState<Program | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Program | null>(null);
  const [form, setForm]               = useState<PF>(emptyPF);
  const [imageFile, setImageFile]     = useState<File | null>(null);
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState(false);

  // Titles already assigned to a programme (other than the one being edited)
  const usedTitles = programs
    .filter(p => !editItem || p.id !== editItem.id)
    .map(p => p.title)
    .filter(Boolean);

  // Available titles = all titles minus those in use by OTHER programmes
  const availableTitles = programTitles.filter(t => !usedTitles.includes(t.title));
  // When editing, also include the current programme's own title
  const availableTitlesForEdit = (prog: Program) =>
    programTitles.filter(t => !usedTitles.includes(t.title) || t.title === prog.title);

  const openAdd = () => {
    setForm({ ...emptyPF });
    setImageFile(null);
    setEditItem(null);
    setAddOpen(true);
  };

  const openEdit = (p: Program) => {
    setForm({ ...p, slug: p.slug || toSlug(p.title) });
    setImageFile(null);
    setEditItem(p);
  };

  const currentAvailable = editItem ? availableTitlesForEdit(editItem) : availableTitles;

  const handleSave = async () => {
    if (!form.title) { error('Please select a programme title'); return; }
    // Ensure slug is generated from title
    const payload = { ...form, slug: form.slug || toSlug(form.title) };
    setSaving(true);
    try {
      const fd = buildFormData(payload, imageFile);
      if (editItem) {
        const res = await api.put.program(editItem.id, fd);
        const updated = res.data?.data ?? { ...editItem, ...payload };
        setPrograms(programs.map(p => p.id === editItem.id ? updated : p));
        success(res.data?.message || 'Programme updated');
        setEditItem(null);
      } else {
        const res = await api.post.program(fd);
        const created = res.data?.data ?? { id: Date.now(), blur_image: '', icon: '', ...payload };
        setPrograms([created, ...programs]);
        success(res.data?.message || 'Programme added');
        setAddOpen(false);
      }
    } catch { error('Failed to save programme'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleting(true);
    setDeleteTarget(null);
    try {
      const res = await api.delete.program(target.id);
      setPrograms(programs.filter(p => p.id !== target.id));
      success((res as any)?.data?.message || 'Programme deleted');
    } catch { error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  const handleSaveTitle = async (id: number | null, name: string) => {
    try {
      if (id !== null) {
        const res = await api.put.programTitle(id, { title: name });
        const updated = res.data?.data ?? { id, title: name };
        setProgramTitles(programTitles.map(t => t.id === id ? updated : t));
        success(res.data?.message || 'Title updated');
      } else {
        const res = await api.post.programTitle({ title: name });
        const created = res.data?.data ?? { id: Date.now(), title: name };
        setProgramTitles([...programTitles, created]);
        success(res.data?.message || 'Title added');
      }
    } catch { error('Failed to save title'); }
  };

  const handleDeleteTitle = async (id: number) => {
    try {
      const res = await api.delete.programTitle(id);
      setProgramTitles(programTitles.filter(t => t.id !== id));
      success((res as any)?.data?.message || 'Title deleted');
    } catch { error('Failed to delete title'); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Programmes</h1>
          <p className={styles.pageSub}>{programs.length} community programmes · {programTitles.length} titles</p>
        </div>
        <Btn onClick={openAdd} disabled={availableTitles.length === 0}>
          <Plus size={14} /> Add Programme
        </Btn>
      </div>

      {/* No titles warning */}
      {programTitles.length === 0 && !loading && (
        <div className={styles.noTitlesWarning}>
          <AlertCircle size={18} />
          <div>
            <strong>No programme titles yet.</strong>
            <span> Create a title below before adding a programme.</span>
          </div>
        </div>
      )}

      {/* Programme cards grid */}
      {!loading && programs.length > 0 && (
        <div className={styles.grid}>
          {programs.map((prog, i) => (
            <motion.div key={prog.id} className={styles.card}
              style={{ '--prog-color': prog.color } as any}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}>
              <div className={styles.cardImg}>
                {prog.image && <BlurImage src={prog.image} blurSrc={(prog as any).blur_image || undefined} alt={prog.title} />}
                <div className={styles.imgOverlay} />
                <div className={styles.colorAccent} style={{ background: prog.color }} />
              </div>
              <div className={styles.cardBody}>
                <span className={styles.tagline}>{prog.tagline}</span>
                <h3 className={styles.title}>{prog.title}</h3>
                <p className={styles.desc}>{prog.description}</p>
                {prog.stats.length > 0 && (
                  <div className={styles.statsRow}>
                    {prog.stats.slice(0, 2).map(s => (
                      <div key={s.label} className={styles.stat}>
                        <span className={styles.statVal} style={{ color: prog.color }}>{s.value}</span>
                        <span className={styles.statLbl}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className={styles.cardActions}>
                  <button className={styles.iconBtn} onClick={() => openEdit(prog)}><Pencil size={13} /></button>
                  <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setDeleteTarget(prog)}><Trash2 size={13} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Programme Titles manager — always at bottom */}
      <TitleManager
        titles={programTitles}
        usedTitles={programs.map(p => p.title)}
        onSave={handleSaveTitle}
        onDelete={handleDeleteTitle}
      />

      {/* Add/Edit Modal */}
      <Modal
        open={addOpen || !!editItem}
        onClose={() => { setAddOpen(false); setEditItem(null); }}
        title={editItem ? `Edit: ${editItem.title}` : 'Add Programme'}
        size="lg"
      >
        <ProgramForm
          value={form}
          imageFile={imageFile}
          onImageChange={setImageFile}
          onChange={setForm}
          isEdit={!!editItem}
          availableTitles={currentAvailable}
        />
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => { setAddOpen(false); setEditItem(null); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave} disabled={currentAvailable.length === 0 && !form.title}>
            {editItem ? 'Save Changes' : 'Add Programme'}
          </Btn>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Programme?"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
      />
    </div>
  );
};

export default Programs;
