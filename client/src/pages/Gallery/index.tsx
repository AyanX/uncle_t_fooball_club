import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import BlurImage from '@/components/common/BlurImage/BlurImage';
import Loader from '@/components/common/Loader/Loader';
import { useAppContext } from '@/context/AppContext';
import { GalleryItem } from '@/data/dummyData';
import styles from './Gallery.module.scss';

interface GalleryItemWithSpan extends GalleryItem { colSpan: number; rowSpan: number; }

function computeSpans(w: number, h: number) {
  const ratio = w / h;
  if (ratio >= 1.6) return { colSpan: 2, rowSpan: 1 };
  if (ratio <= 0.65) return { colSpan: 1, rowSpan: 2 };
  return { colSpan: 1, rowSpan: 1 };
}

function loadDims(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 4, height: 3 });
    img.src = src;
  });
}

const Gallery: React.FC = () => {
  const { gallery, galleryCategories, loading, trackClick } = useAppContext();
  const [catFilter, setCatFilter] = useState('All');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [items, setItems] = useState<GalleryItemWithSpan[]>([]);
  const [spansReady, setSpansReady] = useState(false);

  const computeAll = useCallback(async (rawItems: GalleryItem[]) => {
    setSpansReady(false);
    const results = await Promise.all(rawItems.map(async (item) => {
      const dims = await loadDims(item.image);
      return { ...item, ...computeSpans(dims.width, dims.height) };
    }));
    setItems(results);
    setSpansReady(true);
  }, []);

  useEffect(() => {
    if (!loading.gallery && gallery.length > 0) computeAll(gallery);
  }, [loading.gallery, gallery, computeAll]);

  const filtered = catFilter === 'All' ? items : items.filter((g) => g.category === catFilter);
  const current = lightbox !== null ? filtered[lightbox] : undefined;
  const prev = () => setLightbox((l) => l !== null ? (l - 1 + filtered.length) % filtered.length : null);
  const next = () => setLightbox((l) => l !== null ? (l + 1) % filtered.length : null);

  const allCats = ['All', ...galleryCategories.map((c) => c.title)];

  return (
    <main>
      <PageHeader
        eyebrow="Photo Gallery" title="Life at Uncle T FC"
        subtitle="Matchdays, training sessions, community events, and the moments that define who we are."
        image="https://images.pexels.com/photos/1366913/pexels-photo-1366913.jpeg?auto=compress&cs=tinysrgb&w=1400"
      />

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.filters}>
            {allCats.map((c) => (
              <button key={c} className={`${styles.filterBtn} ${catFilter === c ? styles.active : ''}`} onClick={() => setCatFilter(c)}>{c}</button>
            ))}
          </div>

          {(loading.gallery || !spansReady) ? <Loader /> : (
            <motion.div layout className={styles.grid}>
              <AnimatePresence>
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id} layout
                    className={styles.item}
                    style={{ gridColumn: `span ${item.colSpan}`, gridRow: `span ${item.rowSpan}` }}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
                    onClick={() => { setLightbox(i); trackClick(item.id); }}
                  >
                    <BlurImage src={item.image} blur_image={item.blur_image} alt={item.caption} />
                    <div className={styles.caption}>
                      <span className={styles.captionCat}>{item.category}</span>
                      <p className={styles.captionText}>{item.caption}</p>
                    </div>
                    <div className={styles.zoomHint}><ZoomIn size={20} /></div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {lightbox !== null && current && (
          <motion.div className={styles.lightbox} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}>
            <motion.div className={styles.lightboxInner} initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }} transition={{ duration: 0.25 }} onClick={(e) => e.stopPropagation()}>
              <img src={current.image} alt={current.caption} className={styles.lightboxImg} />
              <div className={styles.lightboxCaption}>
                <span className={styles.lightboxCat}>{current.category}</span>
                <p>{current.caption}</p>
                <span className={styles.lightboxCounter}>{lightbox + 1} / {filtered.length}</span>
              </div>
              <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prev} aria-label="Previous"><ChevronLeft size={24} /></button>
              <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={next} aria-label="Next"><ChevronRight size={24} /></button>
              <button className={styles.closeBtn} onClick={() => setLightbox(null)} aria-label="Close"><X size={22} /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Gallery;
