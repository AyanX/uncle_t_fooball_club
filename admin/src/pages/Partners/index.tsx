// Partners/index.tsx — Partners grouped by tier, optimistic tier name update, always-visible actions
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useToast } from '@/context/ToastContext';
import { api, buildFormData } from '@/services/api';
import { Partner, PartnerTier } from '@/data/dummyData';
import { Modal, ConfirmDialog, Field, Input, Textarea, Select, Btn, Badge } from '@/components/ui';
import ImageInput from '@/components/ui/ImageInput';
import BlurImage from '@/components/ui/BlurImage';
import styles from './Partners.module.scss';

const tierColors: Record<string, string> = { platinum:'#C9A30C', gold:'#d97706', silver:'#6b7280' };

type PartnerForm = Omit<Partner, 'id' | 'blur_image'>;
const emptyPartner: PartnerForm = { name:'', logo:'', tier:'gold', website:'', description:'' };

const PartnerFormEl: React.FC<{
  value: PartnerForm;
  imageFile: File|null;
  onImageChange:(f:File|null)=>void;
  tiers: PartnerTier[];
  onChange:(v:PartnerForm)=>void;
  isEdit:boolean;
}> = ({ value, imageFile, onImageChange, tiers, onChange, isEdit }) => {
  const set = (k: keyof PartnerForm, v: any) => onChange({ ...value, [k]: v });
  return (
    <div className={styles.formGrid}>
      <div style={{gridColumn:'1/-1'}}>
        <ImageInput currentUrl={isEdit ? value.logo||undefined : undefined} onFileChange={onImageChange} label="Partner Logo" aspectRatio="16/9"/>
      </div>
      <Field label="Partner Name" required><Input value={value.name} onChange={e=>set('name',e.target.value)} placeholder="Company Name"/></Field>
      <Field label="Tier">
        <Select value={value.tier} onChange={e=>set('tier',e.target.value)}>
          {tiers.map(t=><option key={t.id} value={t.name}>{t.name.charAt(0).toUpperCase()+t.name.slice(1)}</option>)}
        </Select>
      </Field>
      <Field label="Website URL"><Input value={value.website||''} onChange={e=>set('website',e.target.value)} placeholder="https://example.com (leave blank for no link)"/></Field>
      <div/>
      <div style={{gridColumn:'1/-1'}}>
        <Field label="Description"><Textarea value={value.description} onChange={e=>set('description',e.target.value)} rows={3}/></Field>
      </div>
    </div>
  );
};

const Partners: React.FC = () => {
  const { partners, partnerTiers, setPartners, setPartnerTiers, loading } = useAdminData();
  const { success, error } = useToast();

  const [addOpen, setAddOpen]         = useState(false);
  const [editItem, setEditItem]       = useState<Partner|null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Partner|null>(null);
  const [tierOpen, setTierOpen]       = useState(false);
  const [editTier, setEditTier]       = useState<PartnerTier|null>(null);
  const [deleteTier, setDeleteTier]   = useState<PartnerTier|null>(null);
  const [form, setForm]               = useState<PartnerForm>(emptyPartner);
  const [imageFile, setImageFile]     = useState<File|null>(null);
  const [tierName, setTierName]       = useState('');
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState(false);

  const openAdd  = (tier?:string) => { setForm({...emptyPartner, tier: tier||'gold'}); setImageFile(null); setAddOpen(true); };
  const openEdit = (p:Partner) => { setForm({...p}); setImageFile(null); setEditItem(p); };

  const handleSave = async () => {
    if (!form.name) { error('Partner name required'); return; }
    setSaving(true);
    try {
      const payload = buildFormData({...form}, imageFile, 'image');
      if (editItem) {
        const res = await api.put.partner(editItem.id, payload);
        const updated = res.data?.data ?? { ...editItem, ...form };
        setPartners(partners.map(p => p.id === editItem.id ? updated : p));
        success(res.data?.message || 'Partner updated');
        setEditItem(null);
      } else {
        const res = await api.post.partner(payload);
        const created = res.data?.data ?? { id:Date.now(), blur_image:'', ...form };
        setPartners([...partners, created]);
        success(res.data?.message || 'Partner added');
        setAddOpen(false);
      }
    } catch { error('Failed to save partner'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleting(true);
    setDeleteTarget(null);
    try {
      const res = await api.delete.partner(target.id);
      setPartners(partners.filter(p => p.id !== target.id));
      success((res as any)?.data?.message || 'Partner removed');
    } catch { error('Failed to remove partner'); } finally { setDeleting(false); }
  };

  const openAddTier  = () => { setTierName(''); setEditTier(null); setTierOpen(true); };
  const openEditTier = (t:PartnerTier) => { setTierName(t.name); setEditTier(t); setTierOpen(true); };

  const handleSaveTier = async () => {
    if (!tierName.trim()) { error('Tier name required'); return; }
    setSaving(true);

    // Optimistic: update tier name in UI immediately
    if (editTier) {
      setPartnerTiers(partnerTiers.map(t => t.id === editTier.id ? { ...t, name: tierName.trim() } : t));
      // Also update partner cards under this tier immediately
      setPartners(partners.map(p => p.tier === editTier.name ? { ...p, tier: tierName.trim() } : p));
    }

    try {
      if (editTier) {
        const res = await api.put.partnerTier(editTier.id, { name: tierName.trim() });
        const updated = res.data?.data ?? { ...editTier, name: tierName.trim() };
        setPartnerTiers(partnerTiers.map(t => t.id === editTier.id ? updated : t));
        success(res.data?.message || 'Tier updated');
        setTierOpen(false);
      } else {
        const res = await api.post.partnerTier({ name: tierName.trim() });
        const created = res.data?.data ?? { id:Date.now(), name: tierName.trim() };
        setPartnerTiers([...partnerTiers, created]);
        success(res.data?.message || 'Tier added');
        setTierOpen(false);
      }
    } catch {
      // Rollback optimistic update on failure
      if (editTier) {
        setPartnerTiers(partnerTiers.map(t => t.id === editTier.id ? editTier : t));
        setPartners(partners.map(p => p.tier === tierName.trim() ? { ...p, tier: editTier.name } : p));
      }
      error('Failed to save tier');
    } finally { setSaving(false); }
  };

  const handleDeleteTier = async () => {
    if (!deleteTier) return;
    const target = deleteTier;
    setDeleting(true);
    setDeleteTier(null);
    try {
      const res = await api.delete.partnerTier(target.id);
      setPartnerTiers(partnerTiers.filter(t => t.id !== target.id));
      success((res as any)?.data?.message || 'Tier deleted');
    } catch { error('Failed to delete tier'); } finally { setDeleting(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Partners & Sponsors</h1>
          <p className={styles.pageSub}>{partners.length} partners · {partnerTiers.length} tiers</p>
        </div>
        <div className={styles.headerBtns}>
          <Btn variant="secondary" onClick={openAddTier}><Plus size={14}/> Add Tier</Btn>
          <Btn onClick={() => openAdd()}><Plus size={14}/> Add Partner</Btn>
        </div>
      </div>

      {loading ? (
        <div className={styles.skeleton}/>
      ) : (
        partnerTiers.map(tier => {
          const tierPartners = partners.filter(p => p.tier === tier.name);
          const col = tierColors[tier.name] || '#718096';
          return (
            <div key={tier.id} className={styles.tierSection}>
              <div className={styles.tierHeader} style={{ '--tier-col': col } as any}>
                <div className={styles.tierDot} style={{ background: col }}/>
                <h3 className={styles.tierName}>{tier.name.charAt(0).toUpperCase()+tier.name.slice(1)} Partners</h3>
                <span className={styles.tierCount}>{tierPartners.length}</span>
                {/* Always-visible tier actions */}
                <div className={styles.tierActions}>
                  <button className={styles.tierBtn} onClick={() => openEditTier(tier)} title="Edit tier name"><Pencil size={12}/></button>
                  <button className={`${styles.tierBtn} ${styles.danger}`} onClick={() => setDeleteTier(tier)} title="Delete tier"><Trash2 size={12}/></button>
                </div>
              </div>

              <div className={styles.grid}>
                {/* Add slot for this tier */}
                <div className={styles.addSlot} onClick={() => openAdd(tier.name)}>
                  <Plus size={20}/><span>Add {tier.name} partner</span>
                </div>

                {tierPartners.map((p, i) => (
                  <motion.div key={p.id} className={styles.card} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.3,delay:i*0.06}}>
                    <div className={styles.cardTop}>
                      <div className={styles.logoArea}>
                        {p.logo
                          ? <BlurImage src={p.logo} alt={p.name} className={styles.logoImg}/>
                          : <span className={styles.logoFallback}>{p.name.slice(0,2).toUpperCase()}</span>
                        }
                      </div>
                      <div className={styles.cardMeta}>
                        <h4 className={styles.partnerName}>{p.name}</h4>
                        <span className={styles.tierBadge} style={{ background: col+'20', color: col }}>{tier.name}</span>
                      </div>
                    </div>
                    <p className={styles.desc}>{p.description}</p>
                    {p.website && (
                      <a href={p.website} target="_blank" rel="noopener noreferrer" className={styles.website}>
                        <ExternalLink size={12}/> {p.website.replace(/^https?:\/\/(www\.)?/,'')}
                      </a>
                    )}
                    {/* Always-visible actions */}
                    <div className={styles.cardActions}>
                      <button className={styles.iconBtn} onClick={() => openEdit(p)}><Pencil size={13}/></button>
                      <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setDeleteTarget(p)}><Trash2 size={13}/></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {!loading && partnerTiers.length === 0 && (
        <div className={styles.emptyState}>
          <p>No partner tiers yet — add a tier to get started</p>
          <Btn onClick={openAddTier}><Plus size={14}/> Add First Tier</Btn>
        </div>
      )}

      {/* Partner Modal */}
      <Modal open={addOpen||!!editItem} onClose={() => { setAddOpen(false); setEditItem(null); }} title={editItem ? 'Edit Partner':'Add Partner'} size="md">
        <PartnerFormEl value={form} imageFile={imageFile} onImageChange={setImageFile} tiers={partnerTiers} onChange={setForm} isEdit={!!editItem}/>
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => { setAddOpen(false); setEditItem(null); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}>{editItem ? 'Save Changes':'Add Partner'}</Btn>
        </div>
      </Modal>

      {/* Tier Modal */}
      <Modal open={tierOpen} onClose={() => setTierOpen(false)} title={editTier ? 'Edit Tier':'Add Tier'} size="sm">
        <Field label="Tier Name" required>
          <Input value={tierName} onChange={e=>setTierName(e.target.value)} placeholder="e.g. platinum"/>
        </Field>
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => setTierOpen(false)}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSaveTier}>{editTier ? 'Save':'Add Tier'}</Btn>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Remove Partner?" message={`Remove "${deleteTarget?.name}"?`}/>
      <ConfirmDialog open={!!deleteTier} onClose={() => setDeleteTier(null)} onConfirm={handleDeleteTier} loading={deleting}
        title="Delete Tier?" message={`Delete tier "${deleteTier?.name}"? Partners in this tier will not be deleted.`}/>
    </div>
  );
};

export default Partners;
