// Gallery/index.tsx — Gallery management with ImageInput, always-visible actions, proper responses
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useToast } from '@/context/ToastContext';
import { api, buildFormData } from '@/services/api';
import { GalleryItem, GalleryCategory } from '@/data/dummyData';
import { Modal, ConfirmDialog, Field, Input, Select, Btn, Toggle } from '@/components/ui';
import ImageInput from '@/components/ui/ImageInput';
import styles from './Gallery.module.scss';

type GalleryForm = Omit<GalleryItem, 'id' | 'blur_image'>;
const emptyItem: GalleryForm = { image:'', caption:'', category:'', featured:false };

const GalleryFormEl: React.FC<{
  value: GalleryForm;
  imageFile: File|null;
  onImageChange:(f:File|null)=>void;
  categories: GalleryCategory[];
  onChange:(v:GalleryForm)=>void;
  isEdit:boolean;
}> = ({ value, imageFile, onImageChange, categories, onChange, isEdit }) => {
  const set = (k: keyof GalleryForm, v: any) => onChange({ ...value, [k]: v });
  return (
    <div className={styles.formGrid}>
      <div style={{gridColumn:'1/-1'}}>
        <ImageInput currentUrl={isEdit ? value.image||undefined : undefined} onFileChange={onImageChange} label="Gallery Image" required aspectRatio="4/3"/>
      </div>
      <div style={{gridColumn:'1/-1'}}>
        <Field label="Caption" required><Input value={value.caption} onChange={e=>set('caption',e.target.value)} placeholder="Image caption"/></Field>
      </div>
      <Field label="Category">
        <Select value={value.category} onChange={e=>set('category',e.target.value)}>
          <option value="">Select category…</option>
          {categories.map(c=><option key={c.id} value={c.title}>{c.title}</option>)}
        </Select>
      </Field>
      <div/>
      <div style={{gridColumn:'1/-1'}}>
        <Toggle checked={value.featured} onChange={v=>set('featured',v)} label="Featured (shown large on homepage)"/>
      </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  const { gallery, galleryCategories, setGallery, setGalleryCategories, loading } = useAdminData();
  const { success, error } = useToast();

  const [catFilter, setCatFilter] = useState('All');
  const [addOpen, setAddOpen]     = useState(false);
  const [editItem, setEditItem]   = useState<GalleryItem|null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem|null>(null);
  const [catOpen, setCatOpen]     = useState(false);
  const [editCat, setEditCat]     = useState<GalleryCategory|null>(null);
  const [deleteCat, setDeleteCat] = useState<GalleryCategory|null>(null);
  const [form, setForm]           = useState<GalleryForm>(emptyItem);
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [catTitle, setCatTitle]   = useState('');
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);

  const filtered = catFilter === 'All' ? gallery : gallery.filter(g => g.category === catFilter);

  const openAdd  = () => { setForm({...emptyItem}); setImageFile(null); setAddOpen(true); };
  const openEdit = (item:GalleryItem) => { setForm({...item}); setImageFile(null); setEditItem(item); };
  const openAddCat  = () => { setCatTitle(''); setEditCat(null); setCatOpen(true); };
  const openEditCat = (c:GalleryCategory) => { setCatTitle(c.title); setEditCat(c); setCatOpen(true); };

  const handleSave = async () => {
    if (!form.caption) { error('Caption required'); return; }
    setSaving(true);
    try {
      const payload = buildFormData({...form}, imageFile);
      if (editItem) {
        const res = await api.put.gallery(editItem.id, payload);
        const updated = res.data?.data ?? { ...editItem, ...form };
        setGallery(gallery.map(g => g.id === editItem.id ? updated : g));
        success(res.data?.message || 'Gallery item updated');
        setEditItem(null);
      } else {
        const res = await api.post.gallery(payload);
        const created = res.data?.data ?? { id:Date.now(), blur_image:'', ...form };
        setGallery([created, ...gallery]);
        success(res.data?.message || 'Image added to gallery');
        setAddOpen(false);
      }
    } catch { error('Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleting(true);
    setDeleteTarget(null);
    try {
      const res = await api.delete.gallery(target.id);
      setGallery(gallery.filter(g => g.id !== target.id));
      success((res as any)?.data?.message || 'Image deleted');
    } catch { error('Delete failed'); } finally { setDeleting(false); }
  };

  const handleSaveCat = async () => {
    if (!catTitle.trim()) { error('Category title required'); return; }
    setSaving(true);
    try {
      if (editCat) {
        const res = await api.put.galleryCat(editCat.id, { title: catTitle.trim() });
        const updated = res.data?.data ?? { ...editCat, title: catTitle.trim() };
        setGalleryCategories(galleryCategories.map(c => c.id === editCat.id ? updated : c));
        success(res.data?.message || 'Category updated');
      } else {
        const res = await api.post.galleryCat({ title: catTitle.trim() });
        const created = res.data?.data ?? { id:Date.now(), title: catTitle.trim() };
        setGalleryCategories([...galleryCategories, created]);
        success(res.data?.message || 'Category added');
      }
      setCatOpen(false);
    } catch { error('Failed to save category'); } finally { setSaving(false); }
  };

  const handleDeleteCat = async () => {
    if (!deleteCat) return;
    const target = deleteCat;
    setDeleting(true);
    setDeleteCat(null);
    try {
      const res = await api.delete.galleryCat(target.id);
      setGalleryCategories(galleryCategories.filter(c => c.id !== target.id));
      success((res as any)?.data?.message || 'Category deleted');
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
        <div className={styles.headerBtns}>
          <Btn variant="secondary" onClick={() => setCatOpen(true)}><Plus size={14}/> Categories</Btn>
          <Btn onClick={openAdd}><Plus size={14}/> Add Image</Btn>
        </div>
      </div>

      <div className={styles.filters}>
        {allCats.map(c => (
          <button key={c} className={`${styles.filterBtn} ${catFilter===c ? styles.active:''}`} onClick={() => setCatFilter(c)}>{c}</button>
        ))}
      </div>

      {loading ? <div className={styles.skeleton}/> : (
        <div className={styles.grid}>
          <div className={styles.addSlot} onClick={openAdd}>
            <Plus size={24}/><span>Add Image</span>
          </div>
          {filtered.map((item,i) => (
            <motion.div key={item.id} className={styles.tile}
              initial={{opacity:0,scale:0.93}} animate={{opacity:1,scale:1}} transition={{duration:0.3,delay:i*0.03}}>
              {item.image && <img src={item.image} alt={item.caption} className={styles.tileImg}/>}
              {item.featured && <span className={styles.featuredBadge}><Star size={10}/> Featured</span>}
              <div className={styles.tileOverlay}>
                <span className={styles.tileCat}>{item.category}</span>
                <p className={styles.tileCaption}>{item.caption}</p>
              </div>
              {/* Always-visible */}
              <div className={styles.tileActions}>
                <button className={styles.tileBtn} onClick={() => openEdit(item)}><Pencil size={13}/></button>
                <button className={`${styles.tileBtn} ${styles.danger}`} onClick={() => setDeleteTarget(item)}><Trash2 size={13}/></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Category chips */}
      <div className={styles.catSection}>
        <div className={styles.catHead}>
          <span className={styles.catTitle}>Gallery Categories</span>
          <Btn variant="secondary" onClick={openAddCat}><Plus size={13}/> Add</Btn>
        </div>
        <div className={styles.catList}>
          {galleryCategories.map(c => (
            <div key={c.id} className={styles.catChip}>
              <span>{c.title}</span>
              <span className={styles.catCount}>{gallery.filter(g=>g.category===c.title).length}</span>
              <button className={styles.chipBtn} onClick={() => openEditCat(c)}><Pencil size={11}/></button>
              <button className={`${styles.chipBtn} ${styles.danger}`} onClick={() => setDeleteCat(c)}><Trash2 size={11}/></button>
            </div>
          ))}
          <div className={styles.catAddChip} onClick={openAddCat}><Plus size={14}/> Add Category</div>
        </div>
      </div>

      {/* Modals */}
      <Modal open={addOpen||!!editItem} onClose={() => { setAddOpen(false); setEditItem(null); }} title={editItem ? 'Edit Image':'Add Image'}>
        <GalleryFormEl value={form} imageFile={imageFile} onImageChange={setImageFile} categories={galleryCategories} onChange={setForm} isEdit={!!editItem}/>
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => { setAddOpen(false); setEditItem(null); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSave}>{editItem ? 'Save Changes':'Add to Gallery'}</Btn>
        </div>
      </Modal>

      <Modal open={catOpen} onClose={() => setCatOpen(false)} title={editCat ? 'Edit Category':'Add Category'} size="sm">
        <Field label="Category Title" required>
          <Input value={catTitle} onChange={e=>setCatTitle(e.target.value)} placeholder="Matches"/>
        </Field>
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => setCatOpen(false)}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSaveCat}>{editCat ? 'Save':'Add'}</Btn>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Delete Image?" message={`Delete "${deleteTarget?.caption}"?`}/>
      <ConfirmDialog open={!!deleteCat} onClose={() => setDeleteCat(null)} onConfirm={handleDeleteCat} loading={deleting}
        title="Delete Category?" message={`Delete "${deleteCat?.title}"?`}/>
    </div>
  );
};

export default Gallery;
