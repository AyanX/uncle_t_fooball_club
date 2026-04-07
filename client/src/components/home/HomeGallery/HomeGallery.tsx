
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Camera } from 'lucide-react';
import { GalleryItem } from '@/data/dummyData';
import { useAppContext } from '@/context/AppContext';
import BlurImage from '@/components/common/BlurImage/BlurImage';
import Loader from '@/components/common/Loader/Loader';
import styles from './HomeGallery.module.scss';

interface Props { gallery: GalleryItem[]; loading: boolean; }

const HomeGallery: React.FC<Props> = ({ gallery, loading }) => {
  const { trackClick } = useAppContext();

  const sorted = [...gallery].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  const featured = sorted[0];
  const rest = sorted.slice(1, 5);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}><Camera size={14} /> Gallery</span>
            <h2 className={styles.title}>Life at Uncle T-FC</h2>
          </div>
          <Link to="/gallery" className={styles.seeAll}>View All Photos <ArrowRight size={16} /></Link>
        </div>

        {loading ? <Loader /> : (
          <div className={styles.grid}>
            {featured && (
              <motion.div className={styles.featured}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <Link to="/gallery" onClick={() => trackClick(featured.id)} className={styles.featuredLink}>
                  <div className={styles.featuredImg}>
                    <BlurImage src={featured.image} blur_image={featured.blur_image} alt={featured.caption} />
                    <div className={styles.featuredOverlay} />
                  </div>
                  <div className={styles.featuredBody}>
                    <span className={styles.catBadge}>{featured.category}</span>
                    <p className={styles.featuredCaption}>{featured.caption}</p>
                    <span className={styles.viewAll}>View Gallery <ArrowRight size={14} /></span>
                  </div>
                </Link>
              </motion.div>
            )}

            <div className={styles.sideList}>
              {rest.map((item, i) => (
                <motion.div key={item.id} className={styles.sideCard}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.38, delay: i * 0.08 }}>
                  <Link to="/gallery" onClick={() => trackClick(item.id)} className={styles.sideLink}>
                    <div className={styles.sideImg}>
                      <BlurImage src={item.image} blur_image={item.blur_image} alt={item.caption} />
                    </div>
                    <div className={styles.sideBody}>
                      <span className={styles.sideCat}>{item.category}</span>
                      <p className={styles.sideCaption}>{item.caption}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeGallery;
