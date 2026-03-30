// pages/News/index.tsx — News management: grid like frontend + edit/delete + category management
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, Star, Tag, Image } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';
import { NewsItem, NewsCategory } from '@/data/dummyData';
import { Modal, ConfirmDialog, Field, Input, Textarea, Select, Btn, Toggle } from '@/components/ui';
import styles from './News.module.scss';

const emptyNews: Omit<NewsItem, 'id'> = {
  slug: '', title: '', excerpt: '', content: '', image: '', blur_image: '',
  category: '', author: '', date: new Date().toISOString().slice(0, 10),
  readTime: 3, featured: false,
};

const NewsForm: React.FC<{ value: Omit<NewsItem, 'id'>; categories: NewsCategory[]; onChange: (v: Omit<NewsItem, 'id'>) => void }> = ({ value, categories, onChange }) => {
  const set = (k: keyof typeof value, v: any) => onChange({ ...value, [k]: v });
  return (
    <div className={styles.formGrid}>
      <div style={{ gridColumn: '1 / -1' }}>
        <Field label="Title" required><Input value={value.title} onChange={e => set('title', e.target.value)} placeholder="Article title" /></Field>
      </div>
      <Field label="Slug" required><Input value={value.slug} onChange={e => set('slug', e.target.value)} placeholder="article-slug" /></Field>
      <Field label="Category" required>
        <Select value={value.category} onChange={e => set('category', e.target.value)}>
          <option value="">Select category…</option>
          {categories.map(c => <option key={c.id} value={c.category}>{c.category}</option>)}
        </Select>
      </Field>
      <Field label="Author"><Input value={value.author} onChange={e => set('author', e.target.value)} placeholder="Author name" /></Field>
      <Field label="Date"><Input type="date" value={value.date} onChange={e => set('date', e.target.value)} /></Field>
      <Field label="Read Time (min)"><Input type="number" value={value.readTime} onChange={e => set('readTime', +e.target.value)} min={1} /></Field>
      <Field label="Image URL" required><Input value={value.image} onChange={e => set('image', e.target.value)} placeholder="https://..." /></Field>
      <Field label="Blur Image URL"><Input value={value.blur_image} onChange={e => set('blur_image', e.target.value)} placeholder="https://... (tiny placeholder)" /></Field>
      <div style={{ gridColumn: '1 / -1' }}>
        <Field label="Excerpt" required>
          <Textarea value={value.excerpt} onChange={e => set('excerpt', e.target.value)} rows={3} placeholder="Short summary…" />
        </Field>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <Field label="Full Content (HTML)">
          <Textarea value={value.content} onChange={e => set('content', e.target.value)} rows={8} placeholder="<p>Article content in HTML…</p>" style={{ fontFamily: 'monospace', fontSize: 13 }} />
        </Field>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <Toggle checked={value.featured} onChange={v => set('featured', v)} label="Mark as Featured (shown large on homepage)" />
      </div>
    </div>
  );
};

const CategoryForm: React.FC<{ value: Omit<NewsCategory, 'id'>; onChange: (v: Omit<NewsCategory, 'id'>) => void }> = ({ value, onChange }) => (
  <div className={styles.formGrid}>
    <Field label="Category Name" required><Input value={value.category} onChange={e => onChange({ ...value, category: e.target.value })} placeholder="Match Report" /></Field>
    <Field label="Hero Image URL"><Input value={value.image} onChange={e => onChange({ ...value, image: e.target.value })} placeholder="https://..." /></Field>
  </div>
);

const News: React.FC = () => {
  const { news, newsCategories, setNews, setNewsCategories, loading } = useAdminData();
  const { success, error } = useToast();

  const [catFilter, setCatFilter] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<NewsItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);
  const [catOpen, setCatOpen] = useState(false);
  const [editCat, setEditCat] = useState<NewsCategory | null>(null);
  const [deleteCat, setDeleteCat] = useState<NewsCategory | null>(null);
  const [newsForm, setNewsForm] = useState<Omit<NewsItem, 'id'>>(emptyNews);
  const [catForm, setCatForm] = useState<Omit<NewsCategory, 'id'>>({ category: '', image: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = catFilter === 'All' ? news : news.filter(n => n.category === catFilter);
  const sorted = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  const featured = sorted[0];
  const rest = sorted.slice(1);
  // Empty slots to show + buttons (home shows up to 4 total)
  const emptySlots = Math.max(0, 3 - rest.length);

  const openAdd = () => { setNewsForm({ ...emptyNews, date: new Date().toISOString().slice(0, 10) }); setAddOpen(true); };
  const openEdit = (item: NewsItem) => { setNewsForm({ ...item }); setEditItem(item); };

  const handleSaveNews = async () => {
    if (!newsForm.title || !newsForm.slug) { error('Title and slug are required'); return; }
    setSaving(true);
    try {
      if (editItem) {
        await api.put.news(editItem.id, newsForm);
        setNews(news.map(n => n.id === editItem.id ? { ...editItem, ...newsForm } : n));
        success('News article updated');
        setEditItem(null);
      } else {
        await api.post.news(newsForm);
        setNews([{ id: Date.now(), ...newsForm }, ...news]);
        success('News article published');
        setAddOpen(false);
      }
    } catch { error('Failed to save article'); } finally { setSaving(false); }
  };

  const handleDeleteNews = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete.news(deleteTarget.id);
      setNews(news.filter(n => n.id !== deleteTarget.id));
      success('Article deleted');
      setDeleteTarget(null);
    } catch { error('Failed to delete'); } finally { setDeleting(false); }
  };

  const openAddCat = () => { setCatForm({ category: '', image: '' }); setEditCat(null); setCatOpen(true); };
  const openEditCat = (c: NewsCategory) => { setCatForm({ category: c.category, image: c.image }); setEditCat(c); setCatOpen(true); };

  const handleSaveCat = async () => {
    if (!catForm.category) { error('Category name required'); return; }
    setSaving(true);
    try {
      if (editCat) {
        await api.put.newsCategory(editCat.id, catForm);
        setNewsCategories(newsCategories.map(c => c.id === editCat.id ? { ...editCat, ...catForm } : c));
        success('Category updated');
      } else {
        await api.post.newsCategory(catForm);
        setNewsCategories([...newsCategories, { id: Date.now(), ...catForm }]);
        success('Category added');
      }
      setCatOpen(false);
    } catch { error('Failed to save category'); } finally { setSaving(false); }
  };

  const handleDeleteCat = async () => {
    if (!deleteCat) return;
    setDeleting(true);
    try {
      await api.delete.newsCategory(deleteCat.id);
      setNewsCategories(newsCategories.filter(c => c.id !== deleteCat.id));
      success('Category deleted');
      setDeleteCat(null);
    } catch { error('Failed to delete category'); } finally { setDeleting(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>News Management</h1>
          <p className={styles.pageSub}>{news.length} articles · {newsCategories.length} categories</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="secondary" onClick={() => setCatOpen(true)}><Tag size={14} /> Categories</Btn>
          <Btn onClick={openAdd}><Plus size={14} /> New Article</Btn>
        </div>
      </div>

      {/* Category filter pills */}
      <div className={styles.filters}>
        {['All', ...newsCategories.map(c => c.category)].map(cat => (
          <button key={cat} className={`${styles.filterBtn} ${catFilter === cat ? styles.active : ''}`} onClick={() => setCatFilter(cat)}>{cat}</button>
        ))}
      </div>

      {/* News grid — same layout as frontend (featured large + side list) */}
      {loading ? <div className={styles.skeleton} /> : (
        <div className={styles.newsGrid}>
          {/* Featured / large card */}
          {featured ? (
            <div className={styles.featuredCard}>
              <div className={styles.featuredImg}>
                <img src={featured.image} alt={featured.title} />
                {featured.featured && <span className={styles.featuredBadge}><Star size={11} /> Featured</span>}
                <span className={styles.catBadge}>{featured.category}</span>
                <div className={styles.cardActions}>
                  <Link to={`/news/${featured.id}`} className={styles.actionBtn} title="View / Edit"><Eye size={14} /></Link>
                  <button className={styles.actionBtn} onClick={() => openEdit(featured)} title="Edit"><Pencil size={14} /></button>
                  <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => setDeleteTarget(featured)} title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className={styles.featuredBody}>
                <div className={styles.meta}>
                  <span>{featured.author}</span>
                  <span>{new Date(featured.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>{featured.readTime} min read</span>
                </div>
                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
              </div>
            </div>
          ) : (
            <div className={styles.emptyFeatured} onClick={openAdd}>
              <Plus size={28} />
              <span>Add Featured Article</span>
              <small>First article in the list becomes featured</small>
            </div>
          )}

          {/* Side list */}
          <div className={styles.sideList}>
            {rest.map(item => (
              <div key={item.id} className={styles.sideCard}>
                <div className={styles.sideImg}><img src={item.image} alt={item.title} /></div>
                <div className={styles.sideBody}>
                  <span className={styles.sideCat}>{item.category}</span>
                  <p className={styles.sideTitle}>{item.title}</p>
                  <span className={styles.sideDate}>{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className={styles.sideActions}>
                  <Link to={`/news/${item.id}`} className={styles.iconBtn} title="Edit page"><Eye size={14} /></Link>
                  <button className={styles.iconBtn} onClick={() => openEdit(item)}><Pencil size={14} /></button>
                  <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setDeleteTarget(item)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
            {/* Empty slots */}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div key={`empty-${i}`} className={styles.emptySlot} onClick={openAdd}>
                <Plus size={20} /><span>Add Article</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories panel */}
      <div className={styles.catsSection}>
        <div className={styles.catsHeader}>
          <span className={styles.catsTitle}>News Categories</span>
          <Btn variant="secondary" onClick={openAddCat}><Plus size={13} /> Add Category</Btn>
        </div>
        <div className={styles.catsGrid}>
          {newsCategories.map(cat => (
            <div key={cat.id} className={styles.catCard}>
              {cat.image && <div className={styles.catImg}><img src={cat.image} alt={cat.category} /></div>}
              <div className={styles.catBody}>
                <span className={styles.catName}>{cat.category}</span>
                <span className={styles.catCount}>{news.filter(n => n.category === cat.category).length} articles</span>
              </div>
              <div className={styles.catActions}>
                <button className={styles.iconBtn} onClick={() => openEditCat(cat)}><Pencil size={13} /></button>
                <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => setDeleteCat(cat)}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
          <div className={styles.catAddSlot} onClick={openAddCat}><Plus size={20} /><span>Add Category</span></div>
        </div>
      </div>

      {/* Add/Edit News Modal */}
      <Modal open={addOpen || !!editItem} onClose={() => { setAddOpen(false); setEditItem(null); }} title={editItem ? 'Edit Article' : 'New Article'} size="lg">
        <NewsForm value={newsForm} categories={newsCategories} onChange={setNewsForm} />
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => { setAddOpen(false); setEditItem(null); }}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSaveNews}>{editItem ? 'Save Changes' : 'Publish Article'}</Btn>
        </div>
      </Modal>

      {/* Category Modal */}
      <Modal open={catOpen} onClose={() => setCatOpen(false)} title={editCat ? 'Edit Category' : 'Add Category'} size="sm">
        <CategoryForm value={catForm} onChange={setCatForm} />
        <div className={styles.modalFooter}>
          <Btn variant="secondary" onClick={() => setCatOpen(false)}>Cancel</Btn>
          <Btn loading={saving} onClick={handleSaveCat}>{editCat ? 'Save' : 'Add Category'}</Btn>
        </div>
      </Modal>

      {/* Delete News */}
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteNews} loading={deleting}
        title="Delete Article?" message={`Delete "${deleteTarget?.title}"? This cannot be undone.`} />

      {/* Delete Category */}
      <ConfirmDialog open={!!deleteCat} onClose={() => setDeleteCat(null)} onConfirm={handleDeleteCat} loading={deleting}
        title="Delete Category?" message={`Delete category "${deleteCat?.category}"?`} />
    </div>
  );
};

export default News;
