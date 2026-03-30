// pages/Programs/index.tsx — Programme management
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Trophy, Leaf, Heart, Palette, Star, BookOpen } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';
import { Program } from '@/data/dummyData';
import { Modal, ConfirmDialog, Field, Input, Textarea, Select, Btn } from '@/components/ui';
import styles from './Programs.module.scss';

const ICON_OPTIONS = ['Trophy','Leaf','Heart','Palette','Star','BookOpen'];
const iconMap: Record<string,React.ReactNode> = {
  Trophy:<Trophy size={22}/>, Leaf:<Leaf size={22}/>, Heart:<Heart size={22}/>,
  Palette:<Palette size={22}/>, Star:<Star size={22}/>, BookOpen:<BookOpen size={22}/>,
};

const emptyProgram: Omit<Program,'id'> = {
  slug:'', title:'', tagline:'', description:'', longDescription:'',
  image:'', blur_image:'', icon:'Trophy', color:'#C8102E',
  stats:[], highlights:[],
};

const ProgramForm: React.FC<{ value: Omit<Program,'id'>; onChange: (v: Omit<Program,'id'>) => void }> = ({ value, onChange }) => {
  const set = (k: keyof typeof value, v: any) => onChange({ ...value, [k]: v });
  const [statsText, setStatsText] = useState(value.stats.map(s => `${s.label}:${s.value}`).join('\n'));
  const [hlText, setHlText]       = useState(value.highlights.join('\n'));
  const parseStats = (t: string) => t.split('\n').filter(Boolean).map(l => {
    const [label,...rest] = l.split(':'); return { label: label.trim(), value: rest.join(':').trim() };
  });
  return (
    <div className={styles.formGrid}>
      <Field label="Title" required><Input value={value.title} onChange={e => set('title', e.target.value)} /></Field>
      <Field label="Slug" required><Input value={value.slug} onChange={e => set('slug', e.target.value)} placeholder="sports" /></Field>
      <Field label="Tagline"><Input value={value.tagline} onChange={e => set('tagline', e.target.value)} /></Field>
      <Field label="Icon">
        <Select value={value.icon} onChange={e => set('icon', e.target.value)}>
          {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
        </Select>
      </Field>
      <Field label="Accent Color"><Input type="color" value={value.color} onChange={e => set('color', e.target.value)} style={{ height: 42, padding: '4px 8px', cursor: 'pointer' }} /></Field>
      <Field label="Image URL" required><Input value={value.image} onChange={e => set('image', e.target.value)} placeholder="https://..." /></Field>
      <Field label="Blur Image URL"><Input value={value.blur_image} onChange={e => set('blur_image', e.target.value)} /></Field>
      <div style={{ gridColumn: '1 / -1' }}><Field label="Description"><Textarea value={value.description} onChange={e => set('description', e.target.value)} rows={2} /></Field></div>
      <div style={{ gridColumn: '1 / -1' }}><Field label="Long Description"><Textarea value={value.longDescription} onChange={e => set('longDescription', e.target.value)} rows={4} /></Field></div>
      <div style={{ gridColumn: '1 / -1' }}>
        <Field label="Stats (one per line: Label:Value)">
          <Textarea value={statsText} onChange={e => { setStatsText(e.target.value); set('stats', parseStats(e.target.value)); }} rows={4} placeholder="Youth Players:1200+&#10;Coaches:48" />
        </Field>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <Field label="Highlights (one per line)">
          <Textarea value={hlText} onChange={e => { setHlText(e.target.value); set('highlights', e.target.value.split('\n').filter(Boolean)); }} rows={4} placeholder="Full-season structured programmes for ages 8-18" />
        </Field>
      </div>
    </div>
  );
};

const Programs: React.FC = () => {
  const { programs, setPrograms, loading } = useAdminData();
  const { success, error } = useToast();
  const [addOpen, setAddOpen]      = useState(false);
  const [editItem, setEditItem]    = useState<Program | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Program | null>(null);
  const [form, setForm] = useState<Omit<Program,'id'>>(emptyProgram);
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openAdd  = () => { setForm({...emptyProgram}); setAddOpen(true); };
  const openEdit = (p: Program) => { setForm({...p}); setEditItem(p); };

  const handleSave = async () => {
    if (!form.title || !form.slug) { error('Title and slug required'); return; }
    setSaving(true);
    try {
      if (editItem) {
        await api.put.program(editItem.id, form);
        setPrograms(programs.map(p => p.id === editItem.id ? { ...editItem, ...form } : p));
        success('Programme updated'); setEditItem(null);
      } else {
        await api.post.program(form);
        setPrograms([{ id: Date.now(), ...form }, ...programs]);
        success('Programme added'); setAddOpen(false);
      }
    } catch { error('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete.program(deleteTarget.id);
      setPrograms(programs.filter(p => p.id !== deleteTarget.id));
      success('Programme deleted'); setDeleteTarget(null);
    } catch { error('Delete failed'); } finally { setDeleting(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div><h1 className={styles.pageTitle}>Programmes</h1><p className={styles.pageSub}>{programs.length} community programmes</p></div>
        <Btn onClick={openAdd}><Plus size={14} /> Add Programme</Btn>
      </div>

      <div className={styles.grid}>
        <div className={styles.addSlot} onClick={openAdd}><Plus size={28}/><span>Add Programme</span></div>
        {loading ? null : programs.map((prog, i) => (
          <motion.div key={prog.id} className={styles.card} style={{ '--prog-color': prog.color } as any}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
            <div className={styles.cardImg}>
              <img src={prog.image} alt={prog.title} />
              <div className={styles.imgOverlay}/>
              <div className={styles.iconBadge}>{iconMap[prog.icon]}</div>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.tagline}>{prog.tagline}</span>
              <h3 className={styles.title}>{prog.title}</h3>
              <p className={styles.desc}>{prog.description}</p>
              <div className={styles.statsRow}>
                {prog.stats.slice(0,2).map(s => (
                  <div key={s.label} className={styles.stat}>
                    <span className={styles.statVal}>{s.value}</span>
                    <span className={styles.statLbl}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.cardActions}>
              <button className={styles.editBtn} onClick={() => openEdit(prog)}><Pencil size={14}/></button>
              <button className={styles.deleteBtn} onClick={() => setDeleteTarget(prog)}><Trash2 size={14}/></button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal open={addOpen || !!editItem} onClose={() => { setAddOpen(false); setEditItem(null); }} title={editItem ? 'Edit Programme' : 'Add Programme'} size="lg">
        <ProgramForm value={form} onChange={setForm}/>
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => { setAddOpen(false); setEditItem(null); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}>{editItem ? 'Save Changes' : 'Add Programme'}</Btn>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Delete Programme?" message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}/>
    </div>
  );
};

export default Programs;
