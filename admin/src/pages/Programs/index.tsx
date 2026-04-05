// Programs/index.tsx — with inline stat/highlight item management + programTitles CRUD
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Check, X, GripVertical } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useToast } from '@/context/ToastContext';
import { api, buildFormData } from '@/services/api';
import { Program, ProgramTitle } from '@/data/dummyData';
import { Modal, ConfirmDialog, Field, Input, Textarea, Btn } from '@/components/ui';
import ImageInput from '@/components/ui/ImageInput';
import styles from './Programs.module.scss';

type ProgramForm = Omit<Program, 'id' | 'blur_image' | 'icon'>;

const emptyProgram: ProgramForm = {
  slug:'', title:'', tagline:'', description:'', longDescription:'',
  image:'', color:'#C8102E', stats:[], highlights:[],
};

// ── Inline editable list (for stats & highlights) ─────────
interface EditableListProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  label: string;
}
const EditableList: React.FC<EditableListProps> = ({ items, onChange, placeholder, label }) => {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editVal, setEditVal]       = useState('');
  const [newVal, setNewVal]         = useState('');
  const [adding, setAdding]         = useState(false);

  const startEdit = (i: number) => { setEditingIdx(i); setEditVal(items[i]); };
  const saveEdit  = () => { if (editingIdx === null) return; const next = [...items]; next[editingIdx] = editVal; onChange(next); setEditingIdx(null); };
  const cancelEdit = () => setEditingIdx(null);
  const deleteItem = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const addItem   = () => { if (!newVal.trim()) return; onChange([...items, newVal.trim()]); setNewVal(''); setAdding(false); };

  return (
    <div className={styles.editableList}>
      <span className={styles.editableListLabel}>{label}</span>
      <div className={styles.listItems}>
        {items.map((item, i) => (
          <div key={i} className={styles.listRow}>
            {editingIdx === i ? (
              <div className={styles.listEditRow}>
                <input
                  className={styles.listEditInput}
                  value={editVal}
                  onChange={e => setEditVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                  autoFocus
                />
                <button className={styles.listSaveBtn} onClick={saveEdit}><Check size={14}/></button>
                <button className={styles.listCancelBtn} onClick={cancelEdit}><X size={14}/></button>
              </div>
            ) : (
              <>
                <span className={styles.listItemText}>{item}</span>
                <div className={styles.listItemActions}>
                  <button className={styles.listActionBtn} onClick={() => startEdit(i)} title="Edit"><Pencil size={12}/></button>
                  <button className={`${styles.listActionBtn} ${styles.danger}`} onClick={() => deleteItem(i)} title="Delete"><Trash2 size={12}/></button>
                </div>
              </>
            )}
          </div>
        ))}
        {adding ? (
          <div className={styles.listEditRow}>
            <input
              className={styles.listEditInput}
              value={newVal}
              onChange={e => setNewVal(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addItem(); if (e.key === 'Escape') setAdding(false); }}
              placeholder={placeholder}
              autoFocus
            />
            <button className={styles.listSaveBtn} onClick={addItem}><Check size={14}/></button>
            <button className={styles.listCancelBtn} onClick={() => setAdding(false)}><X size={14}/></button>
          </div>
        ) : (
          <button className={styles.listAddBtn} onClick={() => setAdding(true)}>
            <Plus size={14}/> Add {label}
          </button>
        )}
      </div>
    </div>
  );
};

// ── Stat items (label:value pairs) ───────────────────────
interface StatItem { label: string; value: string; }
interface EditableStatListProps {
  stats: StatItem[];
  onChange: (stats: StatItem[]) => void;
}
const EditableStatList: React.FC<EditableStatListProps> = ({ stats, onChange }) => {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editLabel, setEditLabel]   = useState('');
  const [editValue, setEditValue]   = useState('');
  const [adding, setAdding]         = useState(false);
  const [newLabel, setNewLabel]     = useState('');
  const [newValue, setNewValue]     = useState('');

  const startEdit = (i: number) => { setEditingIdx(i); setEditLabel(stats[i].label); setEditValue(stats[i].value); };
  const saveEdit  = () => {
    if (editingIdx === null) return;
    const next = [...stats]; next[editingIdx] = { label: editLabel, value: editValue };
    onChange(next); setEditingIdx(null);
  };
  const cancelEdit = () => setEditingIdx(null);
  const deleteItem = (i: number) => onChange(stats.filter((_, idx) => idx !== i));
  const addItem   = () => {
    if (!newLabel.trim() || !newValue.trim()) return;
    onChange([...stats, { label: newLabel.trim(), value: newValue.trim() }]);
    setNewLabel(''); setNewValue(''); setAdding(false);
  };

  return (
    <div className={styles.editableList}>
      <span className={styles.editableListLabel}>Stats</span>
      <div className={styles.listItems}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.listRow}>
            {editingIdx === i ? (
              <div className={styles.statEditRow}>
                <input className={styles.listEditInput} value={editLabel} onChange={e => setEditLabel(e.target.value)} placeholder="Label" autoFocus/>
                <input className={styles.listEditInput} value={editValue} onChange={e => setEditValue(e.target.value)} placeholder="Value" onKeyDown={e => { if (e.key === 'Enter') saveEdit(); }}/>
                <button className={styles.listSaveBtn} onClick={saveEdit}><Check size={14}/></button>
                <button className={styles.listCancelBtn} onClick={cancelEdit}><X size={14}/></button>
              </div>
            ) : (
              <>
                <div className={styles.statDisplay}>
                  <span className={styles.statVal}>{stat.value}</span>
                  <span className={styles.statLblSmall}>{stat.label}</span>
                </div>
                <div className={styles.listItemActions}>
                  <button className={styles.listActionBtn} onClick={() => startEdit(i)}><Pencil size={12}/></button>
                  <button className={`${styles.listActionBtn} ${styles.danger}`} onClick={() => deleteItem(i)}><Trash2 size={12}/></button>
                </div>
              </>
            )}
          </div>
        ))}
        {adding ? (
          <div className={styles.statEditRow}>
            <input className={styles.listEditInput} value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label (e.g. Youth Players)" autoFocus/>
            <input className={styles.listEditInput} value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="Value (e.g. 1,200+)" onKeyDown={e => { if (e.key === 'Enter') addItem(); }}/>
            <button className={styles.listSaveBtn} onClick={addItem}><Check size={14}/></button>
            <button className={styles.listCancelBtn} onClick={() => setAdding(false)}><X size={14}/></button>
          </div>
        ) : (
          <button className={styles.listAddBtn} onClick={() => setAdding(true)}>
            <Plus size={14}/> Add Stat
          </button>
        )}
      </div>
    </div>
  );
};

// ── Programme form ────────────────────────────────────────
const ProgramFormEl: React.FC<{
  value: ProgramForm; imageFile: File|null;
  onImageChange:(f:File|null)=>void; onChange:(v:ProgramForm)=>void; isEdit:boolean;
}> = ({ value, imageFile, onImageChange, onChange, isEdit }) => {
  const set = (k: keyof ProgramForm, v: any) => onChange({ ...value, [k]: v });
  return (
    <div className={styles.formGrid}>
      <div style={{gridColumn:'1/-1'}}>
        <ImageInput currentUrl={isEdit ? value.image||undefined : undefined} onFileChange={onImageChange} label="Programme Image" required aspectRatio="16/9"/>
      </div>
      <Field label="Title" required><Input value={value.title} onChange={e=>set('title',e.target.value)}/></Field>
      <Field label="Slug" required><Input value={value.slug} onChange={e=>set('slug',e.target.value)} placeholder="sports"/></Field>
      <Field label="Tagline"><Input value={value.tagline} onChange={e=>set('tagline',e.target.value)}/></Field>
      <Field label="Accent Color">
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <input type="color" value={value.color} onChange={e=>set('color',e.target.value)} style={{width:44,height:44,padding:'4px 6px',cursor:'pointer',borderRadius:8,border:'2px solid rgba(10,20,47,0.1)',background:'#F8F9FA'}}/>
          <Input value={value.color} onChange={e=>set('color',e.target.value)} placeholder="#C8102E" style={{flex:1}}/>
        </div>
      </Field>
      <div style={{gridColumn:'1/-1'}}>
        <Field label="Short Description"><Textarea value={value.description} onChange={e=>set('description',e.target.value)} rows={2}/></Field>
      </div>
      <div style={{gridColumn:'1/-1'}}>
        <Field label="Full Description"><Textarea value={value.longDescription} onChange={e=>set('longDescription',e.target.value)} rows={4}/></Field>
      </div>
      {/* Stats — individual items with edit/delete */}
      <div style={{gridColumn:'1/-1'}}>
        <EditableStatList stats={value.stats} onChange={v=>set('stats',v)}/>
      </div>
      {/* Highlights — individual items with edit/delete */}
      <div style={{gridColumn:'1/-1'}}>
        <EditableList items={value.highlights} onChange={v=>set('highlights',v)} placeholder="e.g. Full-season programmes for ages 8-18" label="Highlight"/>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────
const Programs: React.FC = () => {
  const { programs, programTitles, setPrograms, setProgramTitles, loading } = useAdminData();
  const { success, error } = useToast();

  const [addOpen, setAddOpen]     = useState(false);
  const [editItem, setEditItem]   = useState<Program|null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Program|null>(null);
  const [form, setForm]           = useState<ProgramForm>(emptyProgram);
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);

  // ProgramTitles management (like newsCategories)
  const [titleOpen, setTitleOpen]   = useState(false);
  const [editTitle, setEditTitle]   = useState<ProgramTitle|null>(null);
  const [deleteTitle, setDeleteTitle] = useState<ProgramTitle|null>(null);
  const [titleVal, setTitleVal]     = useState('');
  const [savingTitle, setSavingTitle] = useState(false);
  const [deletingTitle, setDeletingTitle] = useState(false);

  const openAdd  = () => { setForm({...emptyProgram}); setImageFile(null); setAddOpen(true); };
  const openEdit = (p:Program) => { setForm({...p}); setImageFile(null); setEditItem(p); };

  const handleSave = async () => {
    if (!form.title || !form.slug) { error('Title and slug required'); return; }
    setSaving(true);
    try {
      const payload = buildFormData({...form}, imageFile);
      if (editItem) {
        const res = await api.put.program(editItem.id, payload);
        const updated = res.data?.data ?? { ...editItem, ...form };
        setPrograms(programs.map(p => p.id === editItem.id ? updated : p));
        success(res.data?.message || 'Programme updated');
        setEditItem(null);
      } else {
        const res = await api.post.program(payload);
        const created = res.data?.data ?? { id:Date.now(), blur_image:'', icon:'', ...form };
        setPrograms([created, ...programs]); // new at top
        success(res.data?.message || 'Programme added');
        setAddOpen(false);
      }
    } catch { error('Failed to save programme'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleting(true); setDeleteTarget(null);
    try {
      const res = await api.delete.program(target.id);
      setPrograms(programs.filter(p => p.id !== target.id));
      success((res as any)?.data?.message || 'Programme deleted');
    } catch { error('Failed to delete'); } finally { setDeleting(false); }
  };

  const openAddTitle  = () => { setTitleVal(''); setEditTitle(null); setTitleOpen(true); };
  const openEditTitle = (t:ProgramTitle) => { setTitleVal(t.title); setEditTitle(t); setTitleOpen(true); };

  const handleSaveTitle = async () => {
    if (!titleVal.trim()) { error('Title required'); return; }
    setSavingTitle(true);
    try {
      if (editTitle) {
        const res = await api.put.programTitle(editTitle.id, { title: titleVal.trim() });
        const updated = res.data?.data ?? { ...editTitle, title: titleVal.trim() };
        setProgramTitles(programTitles.map(t => t.id === editTitle.id ? updated : t));
        success(res.data?.message || 'Title updated');
      } else {
        const res = await api.post.programTitle({ title: titleVal.trim() });
        const created = res.data?.data ?? { id:Date.now(), title: titleVal.trim() };
        setProgramTitles([...programTitles, created]);
        success(res.data?.message || 'Title added');
      }
      setTitleOpen(false);
    } catch { error('Failed to save title'); } finally { setSavingTitle(false); }
  };

  const handleDeleteTitle = async () => {
    if (!deleteTitle) return;
    const target = deleteTitle;
    setDeletingTitle(true); setDeleteTitle(null);
    try {
      const res = await api.delete.programTitle(target.id);
      setProgramTitles(programTitles.filter(t => t.id !== target.id));
      success((res as any)?.data?.message || 'Title deleted');
    } catch { error('Failed to delete title'); } finally { setDeletingTitle(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Programmes</h1>
          <p className={styles.pageSub}>{programs.length} community programmes</p>
        </div>
        <Btn onClick={openAdd}><Plus size={14}/> Add Programme</Btn>
      </div>

      {/* Programme Titles section (like newsCategories) */}
      <div className={styles.titlesSection}>
        <div className={styles.titlesHead}>
          <span className={styles.titlesLabel}>Programme Titles (for filter dropdown)</span>
          <Btn variant="secondary" onClick={openAddTitle}><Plus size={13}/> Add Title</Btn>
        </div>
        <div className={styles.titlesList}>
          {programTitles.map(t => (
            <div key={t.id} className={styles.titleChip}>
              <span>{t.title}</span>
              <button className={styles.chipBtn} onClick={() => openEditTitle(t)}><Pencil size={11}/></button>
              <button className={`${styles.chipBtn} ${styles.danger}`} onClick={() => setDeleteTitle(t)}><Trash2 size={11}/></button>
            </div>
          ))}
          <div className={styles.titleAddChip} onClick={openAddTitle}><Plus size={14}/> Add Title</div>
        </div>
      </div>

      {/* Programmes grid */}
      <div className={styles.grid}>
        <div className={styles.addSlot} onClick={openAdd}>
          <Plus size={28}/><span>Add Programme</span>
        </div>
        {loading ? null : programs.map((prog,i) => (
          <motion.div key={prog.id} className={styles.card} style={{ '--prog-color': prog.color } as any}
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.3,delay:i*0.05}}>
            <div className={styles.cardImg}>
              {prog.image && <img src={prog.image} alt={prog.title}/>}
              <div className={styles.imgOverlay}/>
              <div className={styles.colorAccent} style={{background:prog.color}}/>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.tagline}>{prog.tagline}</span>
              <h3 className={styles.title}>{prog.title}</h3>
              <p className={styles.desc}>{prog.description}</p>
              {prog.stats.length > 0 && (
                <div className={styles.statsRow}>
                  {prog.stats.slice(0,2).map(s => (
                    <div key={s.label} className={styles.stat}>
                      <span className={styles.statVal} style={{color:prog.color}}>{s.value}</span>
                      <span className={styles.statLbl}>{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.cardActions}>
                <button className={styles.iconBtn} onClick={() => openEdit(prog)}><Pencil size={13}/></button>
                <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setDeleteTarget(prog)}><Trash2 size={13}/></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Programme Modal */}
      <Modal open={addOpen||!!editItem} onClose={() => { setAddOpen(false); setEditItem(null); }} title={editItem ? 'Edit Programme':'Add Programme'} size="lg">
        <ProgramFormEl value={form} imageFile={imageFile} onImageChange={setImageFile} onChange={setForm} isEdit={!!editItem}/>
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => { setAddOpen(false); setEditItem(null); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}>{editItem ? 'Save Changes':'Add Programme'}</Btn>
        </div>
      </Modal>

      {/* Title Modal */}
      <Modal open={titleOpen} onClose={() => setTitleOpen(false)} title={editTitle ? 'Edit Title':'Add Programme Title'} size="sm">
        <Field label="Title" required><Input value={titleVal} onChange={e=>setTitleVal(e.target.value)} placeholder="e.g. Sports Academy"/></Field>
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => setTitleOpen(false)}>Cancel</Btn>
          <Btn loading={savingTitle} onClick={handleSaveTitle}>{editTitle ? 'Save':'Add'}</Btn>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Delete Programme?" message={`Delete "${deleteTarget?.title}"?`}/>
      <ConfirmDialog open={!!deleteTitle} onClose={() => setDeleteTitle(null)} onConfirm={handleDeleteTitle} loading={deletingTitle}
        title="Delete Title?" message={`Delete "${deleteTitle?.title}"?`}/>
    </div>
  );
};

export default Programs;
