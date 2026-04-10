import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, Star, Tag, TrendingUp } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useToast } from '@/context/ToastContext';
import { api, buildFormData } from '@/services/api';
import { NewsItem, NewsCategory } from '@/data/dummyData';
import { Modal, ConfirmDialog, Field, Input, Textarea, Select, Btn, Toggle } from '@/components/ui';
import BlurImage from '@/components/ui/BlurImage';
import ImageInput from '@/components/ui/ImageInput';
import styles from './News.module.scss';

type NewsFormData = Omit<NewsItem, 'id' | 'blur_image'>;

// Normalize date string to YYYY-MM-DD for <input type="date">
const toDateValue = (d?: string): string => { if (!d) return ''; return d.slice(0, 10); };

const toSlug = (t: string) => t.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').slice(0,80);

const emptyNews: NewsFormData = {
  slug:'', title:'', excerpt:'', content:'', image:'',
  category:'', author:'', date: new Date().toISOString().slice(0,10),
  readTime:3, featured:false,
};

const NewsForm: React.FC<{
  value: NewsFormData;
  imageFile: File|null;
  onImageChange: (f:File|null)=>void;
  categories: NewsCategory[];
  onChange: (v:NewsFormData)=>void;
  isEdit: boolean;
}> = ({ value, imageFile, onImageChange, categories, onChange, isEdit }) => {
  const set = (k: keyof NewsFormData, v: any) => onChange({ ...value, [k]: v });
  return (
    <div className={styles.formGrid}>
      <div style={{gridColumn:'1/-1'}}>
        <ImageInput currentUrl={isEdit ? value.image || undefined : undefined} onFileChange={onImageChange} label="Article Image" required aspectRatio="16/9"/>
      </div>
      <div style={{gridColumn:'1/-1'}}>
        <Field label="Title" required>
          <Input value={value.title} onChange={e => {
            const t = e.target.value;
            onChange({ ...value, title: t, slug: toSlug(t) });
          }} placeholder="Article title"/>
        </Field>
      </div>
      <div style={{gridColumn:'1/-1'}}>
        <Field label="Slug (auto-generated from title)">
          <div style={{padding:'10px 14px',background:'rgba(10,20,47,0.04)',borderRadius:8,fontFamily:'monospace',fontSize:13,color:'#6b7280',border:'1.5px solid rgba(10,20,47,0.08)',minHeight:42,display:'flex',alignItems:'center'}}>
            {value.slug || <span style={{opacity:0.4,fontStyle:'italic'}}>Generated from title…</span>}
          </div>
        </Field>
      </div>
      <Field label="Category" required>
        <Select value={value.category} onChange={e=>set('category',e.target.value)}>
          <option value="">Select category…</option>
          {categories.map(c=><option key={c.id} value={c.category}>{c.category}</option>)}
        </Select>
      </Field>
      <Field label="Author"><Input value={value.author} onChange={e=>set('author',e.target.value)} placeholder="Author name"/></Field>
      <Field label="Date"><Input type="date" value={toDateValue(value.date)} onChange={e=>set('date',e.target.value)}/></Field>
      <Field label="Read Time (min)"><Input type="number" value={value.readTime} onChange={e=>set('readTime',+e.target.value)} min={1}/></Field>
      <div style={{gridColumn:'1/-1'}}>
        <Field label="Excerpt" required>
          <Textarea value={value.excerpt} onChange={e=>set('excerpt',e.target.value)} rows={3} placeholder="Short summary…"/>
        </Field>
      </div>
      <div style={{gridColumn:'1/-1'}}>
        <Field label="Full Content (HTML)">
          <Textarea value={value.content} onChange={e=>set('content',e.target.value)} rows={7} placeholder="<p>Article HTML…</p>" style={{fontFamily:'monospace',fontSize:13}}/>
        </Field>
      </div>
      <div style={{gridColumn:'1/-1'}}>
        <Toggle checked={value.featured} onChange={v=>set('featured',v)} label="Mark as Featured"/>
      </div>
    </div>
  );
};

const CategoryForm: React.FC<{
  value: Omit<NewsCategory,'id'>;
  imageFile: File|null;
  onImageChange:(f:File|null)=>void;
  onChange:(v:Omit<NewsCategory,'id'>)=>void;
  isEdit:boolean;
}> = ({ value, imageFile, onImageChange, onChange, isEdit }) => (
  <div style={{display:'flex',flexDirection:'column',gap:16}}>
    <ImageInput currentUrl={isEdit ? value.image||undefined : undefined} onFileChange={onImageChange} label="Category Hero Image" aspectRatio="16/9"/>
    <Field label="Category Name" required>
      <Input value={value.category} onChange={e=>onChange({...value,category:e.target.value})} placeholder="Match Report"/>
    </Field>
  </div>
);

const News: React.FC = () => {
  const { news, newsCategories, newsViews, setNews, setNewsCategories, loading } = useAdminData();
  const { success, error } = useToast();

  const [catFilter, setCatFilter] = useState('All');
  const [addOpen, setAddOpen]     = useState(false);
  const [editItem, setEditItem]   = useState<NewsItem|null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsItem|null>(null);
  const [catOpen, setCatOpen]     = useState(false);
  const [editCat, setEditCat]     = useState<NewsCategory|null>(null);
  const [deleteCat, setDeleteCat] = useState<NewsCategory|null>(null);
  const [newsForm, setNewsForm]   = useState<NewsFormData>(emptyNews);
  const [newsImageFile, setNewsImageFile] = useState<File|null>(null);
  const [catForm, setCatForm]     = useState<Omit<NewsCategory,'id'>>({ category:'', image:'' });
  const [catImageFile, setCatImageFile] = useState<File|null>(null);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);

  const sorted = [...news]
    .sort((a,b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .filter(n => catFilter === 'All' || n.category === catFilter);
  const featured  = sorted[0];
  const rest      = sorted.slice(1);
  const emptySlots = Math.max(0, 3 - rest.length);

  const getViews = (id:number) => newsViews.find(v=>v.newsId===id)?.views ?? 0;

  const openAdd  = () => { setNewsForm({...emptyNews, date:new Date().toISOString().slice(0,10)}); setNewsImageFile(null); setAddOpen(true); };
  const openEdit = (item:NewsItem) => { setNewsForm({...item, date: toDateValue(item.date)}); setNewsImageFile(null); setEditItem(item); };

  // Featured toggle via POST /news/features/:id
  const toggleFeatured = async (item: NewsItem) => {
    try {
      const res = await api.post.toggleFeatured(item.id);
      const updated = res.data?.data ?? { ...item, featured: !item.featured };
      setNews(news.map(n => n.id === item.id ? updated : n));
      success(res.data?.message || (updated.featured ? 'Marked as featured' : 'Removed from featured'));
    } catch { error('Failed to toggle featured'); }
  };

  const handleSaveNews = async () => {
    if (!newsForm.title) { error('Title is required'); return; }
    setSaving(true);
    try {
      const payload = buildFormData({ ...newsForm }, newsImageFile);
      if (editItem) {
        const res = await api.put.news(editItem.id, payload);
        const updated = res.data?.data ?? { ...editItem, ...newsForm };
        setNews(news.map(n => n.id === editItem.id ? updated : n));
        success(res.data?.message || 'Article updated');
        setEditItem(null);
      } else {
        const res = await api.post.news(payload);
        const created = res.data?.data ?? { id: Date.now(), blur_image:'', ...newsForm };
        setNews([created, ...news]);
        success(res.data?.message || 'Article published');
        setAddOpen(false);
      }
    } catch { error('Failed to save article'); } finally { setSaving(false); }
  };

  const handleDeleteNews = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleting(true);
    setDeleteTarget(null);
    try {
      const res = await api.delete.news(target.id);
      setNews(news.filter(n => n.id !== target.id));
      success((res as any)?.data?.message || 'Article deleted');
    } catch { error('Failed to delete article'); } finally { setDeleting(false); }
  };

  const openAddCat  = () => { setCatForm({ category:'', image:'' }); setCatImageFile(null); setEditCat(null); setCatOpen(true); };
  const openEditCat = (c:NewsCategory) => { setCatForm({ category:c.category, image:c.image }); setCatImageFile(null); setEditCat(c); setCatOpen(true); };

  const handleSaveCat = async () => {
    if (!catForm.category) { error('Category name required'); return; }
    setSaving(true);
    try {
      const payload = buildFormData({ category: catForm.category, image: catForm.image }, catImageFile);
      if (editCat) {
        const res = await api.put.newsCategory(editCat.id, payload as any);
        const updated = res.data?.data ?? { ...editCat, ...catForm };
        setNewsCategories(newsCategories.map(c => c.id === editCat.id ? updated : c));
        success(res.data?.message || 'Category updated');
      } else {
        const res = await api.post.newsCategory(payload);
        const created = res.data?.data ?? { id: Date.now(), ...catForm };
        setNewsCategories([...newsCategories, created]);
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
      const res = await api.delete.newsCategory(target.id);
      setNewsCategories(newsCategories.filter(c => c.id !== target.id));
      success((res as any)?.data?.message || 'Category deleted');
    } catch { error('Failed to delete category'); } finally { setDeleting(false); }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>News Management</h1>
          <p className={styles.pageSub}>{news.length} articles · {newsCategories.length} categories</p>
        </div>
        <div className={styles.headerBtns}>
          <Btn variant="secondary" onClick={() => setCatOpen(true)}><Tag size={14}/> Categories</Btn>
          <Btn onClick={openAdd}><Plus size={14}/> New Article</Btn>
        </div>
      </div>

      {/* Views summary */}
      {newsViews.length > 0 && (
        <div className={styles.viewsBar}>
          <div className={styles.viewsBarHead}>
            <TrendingUp size={14} className={styles.viewsIcon}/>
            <span className={styles.viewsTitle}>Top Articles by Views</span>
          </div>
          <div className={styles.viewsList}>
            {[...news].map(n => ({ ...n, v: getViews(n.id) }))
              .sort((a,b) => b.v - a.v).slice(0,5).map((item,i) => (
              <Link key={item.id} to={`/news/${encodeURIComponent(item.title)}`} className={styles.viewItem}>
                <span className={styles.viewRank}>#{i+1}</span>
                <span className={styles.viewName}>{item.title}</span>
                <span className={styles.viewCount}><Eye size={11}/> {item.v.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className={styles.filters}>
        {['All', ...newsCategories.map(c=>c.category)].map(cat => (
          <button key={cat} className={`${styles.filterBtn} ${catFilter===cat ? styles.active:''}`} onClick={() => setCatFilter(cat)}>{cat}</button>
        ))}
      </div>

      {/* News grid */}
      {loading ? <div className={styles.skeleton}/> : (
        <div className={styles.newsGrid}>
          {/* Featured */}
          {featured ? (
            <div className={styles.featuredCard}>
              <div className={styles.featuredImg}>
                {featured.image && <BlurImage src={featured.image} blurSrc={featured.blur_image||undefined} alt={featured.title}/>}
                {featured.featured && <span className={styles.featuredBadge}><Star size={11}/> Featured</span>}
                <span className={styles.catBadge}>{featured.category}</span>
              </div>
              <div className={styles.featuredBody}>
                <div className={styles.metaRow}>
                  <span className={styles.meta}>{featured.author}</span>
                  <span className={styles.meta}>{new Date(featured.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
                  {getViews(featured.id) > 0 && <span className={styles.viewsBadge}><Eye size={11}/> {getViews(featured.id).toLocaleString()}</span>}
                </div>
                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                {/* Always-visible actions */}
                <div className={styles.cardActions}>
                  <Link to={`/news/${encodeURIComponent(featured.title)}`} className={styles.actionBtn} title="Edit article"><Eye size={14}/></Link>
                  <button className={styles.actionBtn} onClick={() => toggleFeatured(featured)} title={featured.featured ? 'Remove featured':'Set featured'}>
                    <Star size={14} style={{fill: featured.featured ? 'currentColor':'none'}}/>
                  </button>
                  <button className={styles.actionBtn} onClick={() => openEdit(featured)} title="Edit"><Pencil size={14}/></button>
                  <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => setDeleteTarget(featured)} title="Delete"><Trash2 size={14}/></button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyFeatured} onClick={openAdd}>
              <Plus size={28}/><span>Add Featured Article</span>
              <small>First article becomes the featured card</small>
            </div>
          )}

          {/* Side list */}
          <div className={styles.sideList}>
            {rest.map(item => (
              <div key={item.id} className={styles.sideCard}>
                <div className={styles.sideImg}>{item.image && <BlurImage src={item.image} blurSrc={item.blur_image||undefined} alt={item.title}/>}</div>
                <div className={styles.sideBody}>
                  <span className={styles.sideCat}>{item.category}</span>
                  <p className={styles.sideTitle}>{item.title}</p>
                  <span className={styles.sideMeta}>{new Date(item.date).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</span>
                  {getViews(item.id) > 0 && <span className={styles.sideViews}><Eye size={11}/> {getViews(item.id).toLocaleString()}</span>}
                </div>
                {/* Always-visible */}
                <div className={styles.sideActions}>
                  <Link to={`/news/${encodeURIComponent(item.title)}`} className={styles.iconBtn} title="Edit article"><Eye size={13}/></Link>
                  <button className={styles.iconBtn} onClick={() => toggleFeatured(item)} title={item.featured ? 'Remove featured':'Set featured'}>
                    <Star size={13} style={{fill: item.featured ? 'currentColor':'none'}}/>
                  </button>
                  <button className={styles.iconBtn} onClick={() => openEdit(item)}><Pencil size={13}/></button>
                  <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setDeleteTarget(item)}><Trash2 size={13}/></button>
                </div>
              </div>
            ))}
            {Array.from({length: emptySlots}).map((_,i) => (
              <div key={`e-${i}`} className={styles.emptySlot} onClick={openAdd}>
                <Plus size={18}/><span>Add Article</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className={styles.catsSection}>
        <div className={styles.catsHead}>
          <span className={styles.catsTitle}>News Categories</span>
          <Btn variant="secondary" onClick={openAddCat}><Plus size={13}/> Add Category</Btn>
        </div>
        <div className={styles.catsGrid}>
          {newsCategories.map(cat => (
            <div key={cat.id} className={styles.catCard}>
              {cat.image && <div className={styles.catImg}><img src={cat.image} alt={cat.category}/></div>}
              <div className={styles.catBody}>
                <span className={styles.catName}>{cat.category}</span>
                <span className={styles.catCount}>{news.filter(n=>n.category===cat.category).length} articles</span>
              </div>
              <div className={styles.catActions}>
                <button className={styles.iconBtn} onClick={() => openEditCat(cat)}><Pencil size={12}/></button>
                <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setDeleteCat(cat)}><Trash2 size={12}/></button>
              </div>
            </div>
          ))}
          <div className={styles.catAddSlot} onClick={openAddCat}><Plus size={18}/><span>Add Category</span></div>
        </div>
      </div>

      {/* Modals */}
      <Modal open={addOpen||!!editItem} onClose={() => { setAddOpen(false); setEditItem(null); }} title={editItem ? 'Edit Article' : 'New Article'} size="lg">
        <NewsForm value={newsForm} imageFile={newsImageFile} onImageChange={setNewsImageFile} categories={newsCategories} onChange={setNewsForm} isEdit={!!editItem}/>
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => { setAddOpen(false); setEditItem(null); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSaveNews}>{editItem ? 'Save Changes' : 'Publish'}</Btn>
        </div>
      </Modal>

      <Modal open={catOpen} onClose={() => setCatOpen(false)} title={editCat ? 'Edit Category' : 'Add Category'} size="sm">
        <CategoryForm value={catForm} imageFile={catImageFile} onImageChange={setCatImageFile} onChange={setCatForm} isEdit={!!editCat}/>
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => setCatOpen(false)}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSaveCat}>{editCat ? 'Save' : 'Add'}</Btn>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteNews} loading={deleting}
        title="Delete Article?" message={`Delete "${deleteTarget?.title}"?`}/>
      <ConfirmDialog open={!!deleteCat} onClose={() => setDeleteCat(null)} onConfirm={handleDeleteCat} loading={deleting}
        title="Delete Category?" message={`Delete "${deleteCat?.category}"?`}/>
    </div>
  );
};

export default News;
