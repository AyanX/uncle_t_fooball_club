// pages/Gallery/index.tsx — Gallery management with dynamic masonry preview
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Star, Tag } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';
import { GalleryItem, GalleryCategory } from '@/data/dummyData';
import { Modal, ConfirmDialog, Field, Input, Select, Btn, Toggle } from '@/components/ui';
import styles from './Gallery.module.scss';

const emptyItem: Omit<GalleryItem, 'id'> = { image: '', blur_image: '', caption: '', category: '', featured: false };

const GalleryForm: React.FC<{ value: Omit<GalleryItem, 'id'>; categories: GalleryCategory[]; onChange: (v: Omit<GalleryItem, 'id'>) => void }> = ({ value, categories, onChange }) => {
  const set = (k: keyof typeof value, v: any) => onChange({ ...value, [k]: v });
  return (
    <div className={styles.formGrid}>
      <div style={{ gridColumn: '1 / -1' }}><Field label="Caption" required><Input value={value.caption} onChange={e => set('caption', e.target.value)} placeholder="Image caption" /></Field></div>
      <Field label="Category">
        <Select value={value.category} onChange={e => set('category', e.target.value)}>
          <option value="">Select category…</option>
          {categories.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
        </Select>
      </Field>
      <div />
      <div style={{ gridColumn: '1 / -1' }}><Field label="Image URL" required><Input value={value.image} onChange={e => set('image', e.target.value)} placeholder="https://..." /></Field></div>
      <div style={{ gridColumn: '1 / -1' }}><Field label="Blur Image URL"><Input value={value.blur_image} onChange={e => set('blur_image', e.target.value)} placeholder="https://... (tiny placeholder)" /></Field></div>
      <div style={{ gridColumn: '1 / -1' }}><Toggle checked={value.featured} onChange={v => set('featured', v)} label="Featured (shown large on homepage)" /></div>
    </div>
  );
};

const Gallery: React.FC = () => {
  const { gallery, galleryCategories, setGallery, setGalleryCategories, loading } = useAdminData();
  const { success, error } = useToast();
  const [catFilter, setCatFilter] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [catOpen, setCatOpen] = useState(false);
  const [editCat, setEditCat] = useState<GalleryCategory | null>(null);
  const [deleteCat, setDeleteCat] = useState<GalleryCategory | null>(null);
  const [form, setForm] = useState<Omit<GalleryItem, 'id'>>(emptyItem);
  const [catForm, setCatForm] = useState({ title: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = catFilter === 'All' ? gallery : gallery.filter(g => g.category === catFilter);

  const openAdd = () => { setForm({ ...emptyItem }); setAddOpen(true); };
  const openEdit = (item: GalleryItem) => { setForm({ ...item }); setEditItem(item); };
  const openAddCat = () => { setCatForm({ title: '' }); setEditCat(null); setCatOpen(true); };
  const openEditCat = (c: GalleryCategory) => { setCatForm({ title: c.title }); setEditCat(c); setCatOpen(true); };

  const handleSave = async () => {
    if (!form.image || !form.caption) { error('Image URL and caption required'); return; }
    setSaving(true);
    try {
      if (editItem) {
        await api.put.gallery(editItem.id, form);
        setGallery(gallery.map(g => g.id === editItem.id ? { ...editItem, ...form } : g));
        success('Gallery item updated');
        setEditItem(null);
      } else {
        await api.post.gallery(form);
        setGallery([{ id: Date.now(), ...form }, ...gallery]);
        success('Image added to gallery');
        setAddOpen(false);
      }
    } catch { error('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete.gallery(deleteTarget.id);
      setGallery(gallery.filter(g => g.id !== deleteTarget.id));
      success('Image deleted');
      setDeleteTarget(null);
    } catch { error('Delete failed'); } finally { setDeleting(false); }
  };

  const handleSaveCat = async () => {
    if (!catForm.title) { error('Category title required'); return; }
    setSaving(true);
    try {
      if (editCat) {
        await api.put.gallery(editCat.id, catForm);
        setGalleryCategories(galleryCategories.map(c => c.id === editCat.id ? { ...editCat, ...catForm } : c));
        success('Category updated');
      } else {
        await api.post.gallery(catForm);
        setGalleryCategories([...galleryCategories, { id: Date.now(), ...catForm }]);
        success('Category added');
      }
      setCatOpen(false);
    } catch { error('Failed to save category'); } finally { setSaving(false); }
  };

  const handleDeleteCat = async () => {
    if (!deleteCat) return;
    setDeleting(true);
    try {
      await api.delete.gallery(deleteCat.id);
      setGalleryCategories(galleryCategories.filter(c => c.id !== deleteCat.id));
      success('Category deleted');
      setDeleteCat(null);
    } catch { error('Failed to delete category'); } finally { setDeleting(false); }
  };

  const allCats = ['All', ...galleryCategories.map(c => c.title)];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Gallery Management</h1>
          <p className={styles.pageSub}>{gallery.length} images · {galleryCategories.length} categories</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="secondary" onClick={() => setCatOpen(true)}><Tag size={14} /> Categories</Btn>
          <Btn onClick={openAdd}><Plus size={14} /> Add Image</Btn>
        </div>
      </div>

      <div className={styles.filters}>
        {allCats.map(c => (
          <button key={c} className={`${styles.filterBtn} ${catFilter === c ? styles.active : ''}`} onClick={() => setCatFilter(c)}>{c}</button>
        ))}
      </div>

      <div className={styles.grid}>
        {/* Add slot */}
        <div className={styles.addSlot} onClick={openAdd}>
          <Plus size={24} />
          <span>Add Image</span>
        </div>

        {loading ? null : filtered.map((item, i) => (
          <motion.div key={item.id} className={styles.tile}
            initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}>
            <img src={item.image} alt={item.caption} className={styles.tileImg} />
            {item.featured && <span className={styles.featuredBadge}><Star size={10} /> Featured</span>}
            <div className={styles.tileOverlay}>
              <span className={styles.tileCat}>{item.category}</span>
              <p className={styles.tileCaption}>{item.caption}</p>
            </div>
            <div className={styles.tileActions}>
              <button className={styles.editBtn} onClick={() => openEdit(item)}><Pencil size={13} /></button>
              <button className={styles.deleteBtn} onClick={() => setDeleteTarget(item)}><Trash2 size={13} /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category manager */}
      <div className={styles.catSection}>
        <div className={styles.catHeader}>
          <span className={styles.catTitle}>Gallery Categories</span>
          <Btn variant="secondary" onClick={openAddCat}><Plus size={13} /> Add</Btn>
        </div>
        <div className={styles.catList}>
          {galleryCategories.map(c => (
            <div key={c.id} className={styles.catChip}>
              <span>{c.title}</span>
              <span className={styles.catCount}>{gallery.filter(g => g.category === c.title).length}</span>
              <button className={styles.iconBtn} onClick={() => openEditCat(c)}><Pencil size={11} /></button>
              <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setDeleteCat(c)}><Trash2 size={11} /></button>
            </div>
          ))}
          <div className={styles.catAddChip} onClick={openAddCat}><Plus size={14} /> Add Category</div>
        </div>
      </div>

      <Modal open={addOpen || !!editItem} onClose={() => { setAddOpen(false); setEditItem(null); }} title={editItem ? 'Edit Image' : 'Add Image'}>
        <GalleryForm value={form} categories={galleryCategories} onChange={setForm} />
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => { setAddOpen(false); setEditItem(null); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}>{editItem ? 'Save Changes' : 'Add to Gallery'}</Btn>
        </div>
      </Modal>

      <Modal open={catOpen} onClose={() => setCatOpen(false)} title={editCat ? 'Edit Category' : 'Add Category'} size="sm">
        <Field label="Category Title" required><Input value={catForm.title} onChange={e => setCatForm({ title: e.target.value })} placeholder="e.g. Matches" /></Field>
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => setCatOpen(false)}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSaveCat}>{editCat ? 'Save' : 'Add'}</Btn>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Delete Image?" message={`Delete "${deleteTarget?.caption}"?`} />
      <ConfirmDialog open={!!deleteCat} onClose={() => setDeleteCat(null)} onConfirm={handleDeleteCat} loading={deleting} title="Delete Category?" message={`Delete category "${deleteCat?.title}"?`} />
    </div>
  );
};

export default Gallery;
