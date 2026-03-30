// pages/Partners/index.tsx — Partners management with tiers
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';
import { Partner, PartnerTier } from '@/data/dummyData';
import { Modal, ConfirmDialog, Field, Input, Textarea, Select, Btn, Badge } from '@/components/ui';
import styles from './Partners.module.scss';

const tierColors: Record<string,string> = { platinum: '#C9A30C', gold: '#F1C40F', silver: '#718096' };

const emptyPartner: Omit<Partner,'id'> = { name:'', logo:'', blur_image:'', tier:'gold', website:'', description:'' };

const PartnerForm: React.FC<{ value: Omit<Partner,'id'>; tiers: PartnerTier[]; onChange: (v: Omit<Partner,'id'>) => void }> = ({ value, tiers, onChange }) => {
  const set = (k: keyof typeof value, v: any) => onChange({ ...value, [k]: v });
  return (
    <div className={styles.formGrid}>
      <Field label="Partner Name" required><Input value={value.name} onChange={e => set('name', e.target.value)} placeholder="Company Name" /></Field>
      <Field label="Tier">
        <Select value={value.tier} onChange={e => set('tier', e.target.value)}>
          {tiers.map(t => <option key={t.id} value={t.name}>{t.name.charAt(0).toUpperCase() + t.name.slice(1)}</option>)}
        </Select>
      </Field>
      <Field label="Website URL"><Input value={value.website || ''} onChange={e => set('website', e.target.value)} placeholder="https://example.com (leave blank for no link)" /></Field>
      <Field label="Logo URL"><Input value={value.logo} onChange={e => set('logo', e.target.value)} placeholder="https://..." /></Field>
      <div style={{ gridColumn: '1/-1' }}>
        <Field label="Description"><Textarea value={value.description} onChange={e => set('description', e.target.value)} rows={3} /></Field>
      </div>
    </div>
  );
};

const TierForm: React.FC<{ value: { name: string }; onChange: (v: { name: string }) => void }> = ({ value, onChange }) => (
  <Field label="Tier Name" required><Input value={value.name} onChange={e => onChange({ name: e.target.value })} placeholder="e.g. platinum" /></Field>
);

const Partners: React.FC = () => {
  const { partners, partnerTiers, setPartners, setPartnerTiers, loading } = useAdminData();
  const { success, error } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);
  const [tierOpen, setTierOpen] = useState(false);
  const [editTier, setEditTier] = useState<PartnerTier | null>(null);
  const [deleteTier, setDeleteTier] = useState<PartnerTier | null>(null);
  const [form, setForm] = useState<Omit<Partner,'id'>>(emptyPartner);
  const [tierForm, setTierForm] = useState({ name: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openAdd = () => { setForm({ ...emptyPartner }); setAddOpen(true); };
  const openEdit = (p: Partner) => { setForm({ ...p }); setEditItem(p); };
  const openAddTier = () => { setTierForm({ name: '' }); setEditTier(null); setTierOpen(true); };
  const openEditTier = (t: PartnerTier) => { setTierForm({ name: t.name }); setEditTier(t); setTierOpen(true); };

  const handleSave = async () => {
    if (!form.name) { error('Partner name required'); return; }
    setSaving(true);
    try {
      if (editItem) {
        await api.put.partner(editItem.id, form);
        setPartners(partners.map(p => p.id === editItem.id ? { ...editItem, ...form } : p));
        success('Partner updated'); setEditItem(null);
      } else {
        await api.post.partner(form);
        setPartners([...partners, { id: Date.now(), ...form }]);
        success('Partner added'); setAddOpen(false);
      }
    } catch { error('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete.partner(deleteTarget.id);
      setPartners(partners.filter(p => p.id !== deleteTarget.id));
      success('Partner deleted'); setDeleteTarget(null);
    } catch { error('Delete failed'); } finally { setDeleting(false); }
  };

  const handleSaveTier = async () => {
    if (!tierForm.name) { error('Tier name required'); return; }
    setSaving(true);
    try {
      if (editTier) {
        await api.put.partner(editTier.id, tierForm);
        setPartnerTiers(partnerTiers.map(t => t.id === editTier.id ? { ...editTier, ...tierForm } : t));
        success('Tier updated');
      } else {
        await api.post.partner(tierForm);
        setPartnerTiers([...partnerTiers, { id: Date.now(), ...tierForm }]);
        success('Tier added');
      }
      setTierOpen(false);
    } catch { error('Failed to save tier'); } finally { setSaving(false); }
  };

  const handleDeleteTier = async () => {
    if (!deleteTier) return;
    setDeleting(true);
    try {
      await api.delete.partner(deleteTier.id);
      setPartnerTiers(partnerTiers.filter(t => t.id !== deleteTier.id));
      success('Tier deleted'); setDeleteTier(null);
    } catch { error('Failed to delete tier'); } finally { setDeleting(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div><h1 className={styles.pageTitle}>Partners & Sponsors</h1><p className={styles.pageSub}>{partners.length} partners · {partnerTiers.length} tiers</p></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="secondary" onClick={() => setTierOpen(true)}><Plus size={14} /> Tiers</Btn>
          <Btn onClick={openAdd}><Plus size={14} /> Add Partner</Btn>
        </div>
      </div>

      {/* Grouped by tier */}
      {loading ? <div className={styles.skeleton} /> : partnerTiers.map(tier => {
        const tierPartners = partners.filter(p => p.tier === tier.name);
        return (
          <div key={tier.id} className={styles.tierSection}>
            <div className={styles.tierHeader}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: tierColors[tier.name] || '#718096', flexShrink: 0 }} />
              <span className={styles.tierName}>{tier.name.charAt(0).toUpperCase() + tier.name.slice(1)} Partners</span>
              <span className={styles.tierCount}>{tierPartners.length}</span>
              <button className={styles.tierEditBtn} onClick={() => openEditTier(tier)}><Pencil size={11} /></button>
              <button className={`${styles.tierEditBtn} ${styles.danger}`} onClick={() => setDeleteTier(tier)}><Trash2 size={11} /></button>
            </div>
            <div className={styles.grid}>
              {/* Add slot for this tier */}
              <div className={styles.addSlot} onClick={() => { setForm({ ...emptyPartner, tier: tier.name }); setAddOpen(true); }}>
                <Plus size={20} /><span>Add {tier.name}</span>
              </div>
              {tierPartners.map((p, i) => (
                <motion.div key={p.id} className={styles.card}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.06 }}>
                  <div className={styles.cardHeader}>
                    <div className={styles.logoArea}>
                      {p.logo ? <img src={p.logo} alt={p.name} className={styles.logoImg} /> : <span className={styles.logoFallback}>{p.name.slice(0, 2).toUpperCase()}</span>}
                    </div>
                    <div className={styles.cardMeta}>
                      <h4 className={styles.partnerName}>{p.name}</h4>
                      <Badge text={p.tier} color={tierColors[p.tier] || '#718096'} />
                    </div>
                  </div>
                  <p className={styles.desc}>{p.description}</p>
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" className={styles.website}>
                      <ExternalLink size={12} /> {p.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                  <div className={styles.cardActions}>
                    <button className={styles.editBtn} onClick={() => openEdit(p)}><Pencil size={13} /></button>
                    <button className={styles.deleteBtn} onClick={() => setDeleteTarget(p)}><Trash2 size={13} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      {partnerTiers.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <p>No partner tiers defined. Add a tier first.</p>
          <Btn onClick={openAddTier}><Plus size={14} /> Add Tier</Btn>
        </div>
      )}

      <Modal open={addOpen || !!editItem} onClose={() => { setAddOpen(false); setEditItem(null); }} title={editItem ? 'Edit Partner' : 'Add Partner'}>
        <PartnerForm value={form} tiers={partnerTiers} onChange={setForm} />
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => { setAddOpen(false); setEditItem(null); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}>{editItem ? 'Save Changes' : 'Add Partner'}</Btn>
        </div>
      </Modal>

      <Modal open={tierOpen} onClose={() => setTierOpen(false)} title={editTier ? 'Edit Tier' : 'Add Tier'} size="sm">
        <TierForm value={tierForm} onChange={setTierForm} />
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => setTierOpen(false)}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSaveTier}>{editTier ? 'Save' : 'Add Tier'}</Btn>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Remove Partner?" message={`Remove "${deleteTarget?.name}" from partners?`} />
      <ConfirmDialog open={!!deleteTier} onClose={() => setDeleteTier(null)} onConfirm={handleDeleteTier} loading={deleting} title="Delete Tier?" message={`Delete tier "${deleteTier?.name}"?`} />
    </div>
  );
};

export default Partners;
