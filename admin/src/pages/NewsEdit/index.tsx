// pages/NewsEdit/index.tsx — Full article editor with inline edit icons per field
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Pencil, Check, X, Save, Star, Trash2 } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';
import { NewsItem } from '@/data/dummyData';
import { Field, Input, Textarea, Select, Btn, Toggle, ConfirmDialog } from '@/components/ui';
import styles from './NewsEdit.module.scss';

// Inline editable field
const InlineField: React.FC<{
  label: string; value: string;
  onSave: (v: string) => void; multiline?: boolean; mono?: boolean;
}> = ({ label, value, onSave, multiline, mono }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => { onSave(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  return (
    <div className={styles.inlineField}>
      <div className={styles.inlineLabel}>
        <span>{label}</span>
        {!editing && (
          <button className={styles.editIcon} onClick={() => setEditing(true)} title={`Edit ${label}`}>
            <Pencil size={12} />
          </button>
        )}
      </div>
      {editing ? (
        <div className={styles.inlineEdit}>
          {multiline ? (
            <textarea
              className={styles.inlineTextarea}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              rows={mono ? 10 : 4}
              style={mono ? { fontFamily: 'monospace', fontSize: 13 } : {}}
              autoFocus
            />
          ) : (
            <input className={styles.inlineInput} value={draft} onChange={e => setDraft(e.target.value)} autoFocus />
          )}
          <div className={styles.inlineActions}>
            <button className={styles.saveBtn} onClick={save}><Check size={14} /></button>
            <button className={styles.cancelBtn} onClick={cancel}><X size={14} /></button>
          </div>
        </div>
      ) : (
        <div className={styles.inlineValue} onClick={() => setEditing(true)}>
          {value || <span className={styles.empty}>Click to edit…</span>}
        </div>
      )}
    </div>
  );
};

const NewsEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { news, newsCategories, setNews } = useAdminData();
  const { success, error } = useToast();

  const [article, setArticle] = useState<NewsItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const found = news.find(n => n.id === Number(id));
    if (found) setArticle({ ...found });
    else navigate('/news', { replace: true });
  }, [id, news, navigate]);

  if (!article) return null;

  const update = (key: keyof NewsItem, val: any) => setArticle(prev => prev ? { ...prev, [key]: val } : prev);

  const saveAll = async () => {
    if (!article) return;
    setSaving(true);
    try {
      await api.put.news(article.id, article);
      setNews(news.map(n => n.id === article.id ? article : n));
      success('Article saved successfully');
    } catch { error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!article) return;
    setDeleting(true);
    try {
      await api.delete.news(article.id);
      setNews(news.filter(n => n.id !== article.id));
      success('Article deleted');
      navigate('/news', { replace: true });
    } catch { error('Delete failed'); }
    finally { setDeleting(false); }
  };

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <div className={styles.topBar}>
        <Link to="/news" className={styles.backBtn}><ArrowLeft size={16} /> All News</Link>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="danger" onClick={() => setDeleteOpen(true)}><Trash2 size={14} /> Delete</Btn>
          <Btn loading={saving} onClick={saveAll}><Save size={14} /> Save All Changes</Btn>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Main article editor */}
        <div className={styles.main}>
          {/* Hero image preview */}
          <div className={styles.heroPreview}>
            {article.image && <img src={article.image} alt={article.title} className={styles.heroImg} />}
            <div className={styles.heroOverlay} />
            <div className={styles.heroCat}>{article.category}</div>
            <div className={styles.heroTitleWrap}>
              <h1 className={styles.heroTitle}>{article.title}</h1>
            </div>
          </div>

          <div className={styles.articleBody}>
            <InlineField label="Title" value={article.title} onSave={v => update('title', v)} />
            <InlineField label="Slug (URL)" value={article.slug} onSave={v => update('slug', v)} />
            <InlineField label="Excerpt" value={article.excerpt} onSave={v => update('excerpt', v)} multiline />
            <InlineField label="Image URL" value={article.image} onSave={v => update('image', v)} />
            <InlineField label="Blur Image URL" value={article.blur_image} onSave={v => update('blur_image', v)} />

            {/* Article image preview */}
            {article.image && (
              <div className={styles.imgPreview}>
                <img src={article.image} alt="Article" />
              </div>
            )}

            <InlineField label="Content (HTML)" value={article.content} onSave={v => update('content', v)} multiline mono />
          </div>
        </div>

        {/* Sidebar meta */}
        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}>Publish Settings</h3>

            <Field label="Category">
              <Select value={article.category} onChange={e => update('category', e.target.value)}>
                <option value="">Select…</option>
                {newsCategories.map(c => <option key={c.id} value={c.category}>{c.category}</option>)}
              </Select>
            </Field>

            <Field label="Author">
              <Input value={article.author} onChange={e => update('author', e.target.value)} />
            </Field>

            <Field label="Publish Date">
              <Input type="date" value={article.date} onChange={e => update('date', e.target.value)} />
            </Field>

            <Field label="Read Time (min)">
              <Input type="number" value={article.readTime} onChange={e => update('readTime', +e.target.value)} min={1} />
            </Field>

            <div style={{ marginTop: 12 }}>
              <Toggle checked={article.featured} onChange={v => update('featured', v)} label="Featured Article" />
            </div>

            <div className={styles.metaRow}>
              <span className={styles.metaKey}>Article ID</span>
              <span className={styles.metaVal}>#{article.id}</span>
            </div>
          </div>

          {/* Quick preview of image */}
          {article.image && (
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Image Preview</h3>
              <div className={styles.thumbPreview}>
                <img src={article.image} alt="" />
              </div>
            </div>
          )}
        </aside>
      </div>

      <ConfirmDialog
        open={deleteOpen} onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Article?" message={`Permanently delete "${article.title}"?`}
      />
    </div>
  );
};

export default NewsEdit;
