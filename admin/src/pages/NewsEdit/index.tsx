// NewsEdit/index.tsx — route /news/:title — rich text editor, blur_image, proper response handling
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Check, X, Save, Star, Trash2, Eye, Bold } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import { useToast } from '@/context/ToastContext';
import { api, buildFormData } from '@/services/api';
import { NewsItem } from '@/data/dummyData';
import { Field, Input, Textarea, Select, Btn, Toggle, ConfirmDialog } from '@/components/ui';
import ImageInput from '@/components/ui/ImageInput';
import styles from './NewsEdit.module.scss';

// ── HTML ↔ plain text conversions ────────────────────────
/** Convert HTML content from server to user-readable plain text */
function htmlToPlain(html: string): string {
  if (!html) return '';
  return html
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<p>/gi, '')
    .replace(/<\/p>/gi, '')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/** Convert user plain text (with **bold** markers) to HTML */
function plainToHtml(text: string): string {
  if (!text.trim()) return '';
  return text
    .split(/\n{2,}/)
    .map(para => para.trim())
    .filter(Boolean)
    .map(para => {
      const lines = para.split('\n').join('<br/>');
      const withBold = lines.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      return `<p>${withBold}</p>`;
    })
    .join('');
}

// ── Inline field with pencil edit ────────────────────────
const InlineField: React.FC<{ label:string; value:string; onSave:(v:string)=>void; multiline?:boolean }> = ({ label, value, onSave, multiline }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);
  useEffect(() => { setDraft(value); }, [value]);
  const save   = () => { onSave(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };
  return (
    <div className={styles.inlineField}>
      <div className={styles.inlineLabel}>
        <span>{label}</span>
        {!editing && <button className={styles.editIcon} onClick={() => { setDraft(value); setEditing(true); }}><Pencil size={11}/></button>}
      </div>
      {editing ? (
        <div className={styles.inlineEdit}>
          {multiline
            ? <textarea className={styles.inlineTextarea} value={draft} onChange={e=>setDraft(e.target.value)} rows={4} autoFocus/>
            : <input className={styles.inlineInput} value={draft} onChange={e=>setDraft(e.target.value)} autoFocus onKeyDown={e=>{ if(e.key==='Enter')save(); if(e.key==='Escape')cancel(); }}/>
          }
          <div className={styles.inlineActions}>
            <button className={styles.saveBtn} onClick={save}><Check size={14}/></button>
            <button className={styles.cancelBtn} onClick={cancel}><X size={14}/></button>
          </div>
        </div>
      ) : (
        <div className={styles.inlineValue} onClick={() => { setDraft(value); setEditing(true); }}>
          {value || <span className={styles.empty}>Click to edit…</span>}
        </div>
      )}
    </div>
  );
};

// ── Rich plain-text content editor ───────────────────────
const ContentEditor: React.FC<{ value: string; onSave: (htmlVal: string) => void }> = ({ value, onSave }) => {
  // value is HTML from server; we display as plain text to user
  const [plain, setPlain]     = useState(() => htmlToPlain(value));
  const [boldActive, setBold] = useState(false);
  const [editing, setEditing] = useState(false);
  const textareaRef           = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setPlain(htmlToPlain(value)); }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // When bold is active, wrap typed char or selection in **
    if (boldActive && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const ta = textareaRef.current!;
      const { selectionStart: ss, selectionEnd: se } = ta;
      const before = plain.slice(0, ss);
      const after  = plain.slice(se);
      const char   = e.key;
      const next   = `${before}**${char}**${after}`;
      setPlain(next);
      // Move cursor inside the closing **
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = ss + 3;
      });
    }
  };

  const wrapBold = () => {
    const ta = textareaRef.current;
    if (!ta) { setBold(v => !v); return; }
    const { selectionStart: ss, selectionEnd: se } = ta;
    if (ss !== se) {
      // Wrap selected text
      const selected = plain.slice(ss, se);
      const next = plain.slice(0, ss) + `**${selected}**` + plain.slice(se);
      setPlain(next);
      requestAnimationFrame(() => { ta.selectionStart = ss; ta.selectionEnd = se + 4; });
    } else {
      setBold(v => !v);
    }
  };

  const handleSave = () => {
    onSave(plainToHtml(plain));
    setEditing(false);
    setBold(false);
  };

  const handleCancel = () => {
    setPlain(htmlToPlain(value));
    setEditing(false);
    setBold(false);
  };

  return (
    <div className={styles.inlineField}>
      <div className={styles.inlineLabel}>
        <span>Content</span>
        {!editing && <button className={styles.editIcon} onClick={() => setEditing(true)}><Pencil size={11}/></button>}
      </div>

      {editing ? (
        <div className={styles.contentEditorWrap}>
          {/* Toolbar */}
          <div className={styles.editorToolbar}>
            <button
              className={`${styles.toolbarBtn} ${boldActive ? styles.toolbarActive : ''}`}
              onClick={wrapBold}
              title={boldActive ? 'Bold ON — click to turn off or select text to wrap' : 'Bold — select text to wrap or toggle on for next typing'}
              type="button"
            >
              <Bold size={14}/>
              <span>{boldActive ? 'Bold ON' : 'Bold'}</span>
            </button>
            <span className={styles.editorHint}>
              Tip: Double press Enter for new paragraph · Select text + Bold to wrap · **text** = bold
            </span>
          </div>
          <textarea
            ref={textareaRef}
            className={styles.contentTextarea}
            value={plain}
            onChange={e => setPlain(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={12}
            placeholder="Write your article content here. Press Enter twice for a new paragraph. Use the Bold button to add bold text."
            autoFocus
          />
          <div className={styles.editorPreview}>
            <span className={styles.previewLabel}>Preview:</span>
            <div className={styles.previewContent} dangerouslySetInnerHTML={{ __html: plainToHtml(plain) }}/>
          </div>
          <div className={styles.inlineActions}>
            <button className={styles.saveBtn} onClick={handleSave}><Check size={14}/> Save Content</button>
            <button className={styles.cancelBtn} onClick={handleCancel}><X size={14}/> Cancel</button>
          </div>
        </div>
      ) : (
        <div className={styles.contentPreviewRead} onClick={() => setEditing(true)}>
          {plain ? (
            <div className={styles.contentText}>{plain.slice(0, 300)}{plain.length > 300 ? '…' : ''}</div>
          ) : (
            <span className={styles.empty}>Click to edit content…</span>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main NewsEdit ─────────────────────────────────────────
const NewsEdit: React.FC = () => {
  const { title }    = useParams<{ title: string }>();
  const navigate     = useNavigate();
  const { news, newsCategories, newsViews, setNews } = useAdminData();
  const { success, error } = useToast();

  const [article, setArticle]   = useState<NewsItem|null>(null);
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [saving, setSaving]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const decoded = decodeURIComponent(title || '');
    const found = news.find(n => n.title === decoded);
    if (found) setArticle({ ...found });
    else navigate('/news', { replace: true });
  }, [title, news, navigate]);

  if (!article) return null;

  const viewCount = newsViews.find(v => v.newsId === article.id)?.views ?? 0;
  const categoryData = newsCategories.find(c => c.category === article.category);
  const heroImage = categoryData?.image || article.image || '';

  const update = (key: keyof NewsItem, val: any) => setArticle(p => p ? { ...p, [key]: val } : p);

  const saveAll = async () => {
    if (!article) return;
    setSaving(true);
    try {
      const { blur_image, ...rest } = article;
      const payload = buildFormData(rest, imageFile);
      const res = await api.put.news(article.id, payload);
      const updated = res.data?.data ?? article;
      setNews(news.map(n => n.id === article.id ? updated : n));
      setArticle(updated);
      success(res.data?.message || 'Article saved');
    } catch { error('Failed to save'); } finally { setSaving(false); }
  };

  const toggleFeatured = async () => {
    try {
      const res = await api.post.toggleFeatured(article.id);
      const updated = res.data?.data ?? { ...article, featured: !article.featured };
      setNews(news.map(n => n.id === article.id ? updated : n));
      setArticle(updated);
      success(res.data?.message || (updated.featured ? 'Marked as featured' : 'Removed from featured'));
    } catch { error('Failed to toggle featured'); }
  };

  const handleDelete = async () => {
    setDeleting(true); setDeleteOpen(false);
    try {
      const res = await api.delete.news(article.id);
      setNews(news.filter(n => n.id !== article.id));
      success((res as any)?.data?.message || 'Article deleted');
      navigate('/news', { replace: true });
    } catch { error('Delete failed'); } finally { setDeleting(false); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link to="/news" className={styles.backBtn}><ArrowLeft size={15}/> All News</Link>
        <div className={styles.topActions}>
          <button className={`${styles.featBtn} ${article.featured ? styles.featActive:''}`} onClick={toggleFeatured}>
            <Star size={14} style={{fill: article.featured ? 'currentColor':'none'}}/> {article.featured ? 'Featured':'Set Featured'}
          </button>
          {viewCount > 0 && <div className={styles.viewsBadge}><Eye size={13}/> {viewCount.toLocaleString()} views</div>}
          <Btn variant="danger" onClick={() => setDeleteOpen(true)}><Trash2 size={13}/> Delete</Btn>
          <Btn loading={saving} onClick={saveAll}><Save size={13}/> Save All</Btn>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.main}>
          {/* Hero preview */}
          <div className={styles.heroPreview} style={{ backgroundImage: heroImage ? `url(${heroImage})` : undefined }}>
            <div className={styles.heroOverlay}/>
            <div className={styles.heroContent}>
              <span className={styles.heroCat}>{article.category}</span>
              <h1 className={styles.heroTitle}>{article.title}</h1>
            </div>
          </div>

          <div className={styles.articleBody}>
            <InlineField label="Title"    value={article.title}   onSave={v=>update('title',v)}/>
            <InlineField label="Slug"     value={article.slug}    onSave={v=>update('slug',v)}/>
            <InlineField label="Excerpt"  value={article.excerpt} onSave={v=>update('excerpt',v)} multiline/>

            {/* Article image with blur placeholder */}
            <div className={styles.inlineField}>
              <span className={styles.inlineLabel}>Article Image</span>
              <ImageInput
                currentUrl={article.image||undefined}
                blurUrl={article.blur_image||undefined}
                onFileChange={setImageFile}
                label=""
                aspectRatio="16/9"
              />
            </div>

            {/* Rich plain-text content editor */}
            <ContentEditor value={article.content} onSave={v=>update('content',v)}/>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}>Publish Settings</h3>
            <Field label="Category">
              <Select value={article.category} onChange={e=>update('category',e.target.value)}>
                <option value="">Select…</option>
                {newsCategories.map(c=><option key={c.id} value={c.category}>{c.category}</option>)}
              </Select>
            </Field>
            <Field label="Author"><Input value={article.author} onChange={e=>update('author',e.target.value)}/></Field>
            <Field label="Publish Date"><Input type="date" value={article.date} onChange={e=>update('date',e.target.value)}/></Field>
            <Field label="Read Time (min)"><Input type="number" value={article.readTime} onChange={e=>update('readTime',+e.target.value)} min={1}/></Field>
            <Toggle checked={article.featured} onChange={v=>update('featured',v)} label="Featured"/>
            <div className={styles.metaRow}>
              <span className={styles.metaKey}>Views</span>
              <span className={styles.metaVal}>{viewCount.toLocaleString()}</span>
            </div>
          </div>
        </aside>
      </div>

      <ConfirmDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} loading={deleting}
        title="Delete Article?" message={`Permanently delete "${article.title}"?`}/>
    </div>
  );
};

export default NewsEdit;
