import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { NewsItem } from '@/data/dummyData';
import { useAppContext } from '@/context/AppContext';
import BlurImage from '@/components/common/BlurImage/BlurImage';
import SectionTitle from '@/components/common/SectionTitle/SectionTitle';
import Loader from '@/components/common/Loader/Loader';
import styles from './FeaturedNews.module.scss';

interface Props { news: NewsItem[]; loading: boolean; }

const FeaturedNews: React.FC<Props> = ({ news, loading }) => {
  const { trackClick } = useAppContext();

  const sorted =  news ? [...news].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)) : [];
  const featured = sorted[0];
  const rest = sorted?.slice(1, 4);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <SectionTitle eyebrow="Latest From The Club" title="News & Updates" subtitle="Stay up to date with everything happening at Uncle T FC." />
          <Link to="/news" className={styles.seeAll}>All News <ArrowRight size={16} /></Link>
        </div>

        {loading ||  !news ? <Loader /> : (
          <div className={styles.grid}>
            {featured && (
              <motion.div className={styles.featured}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <Link to={`/news/${featured.slug}`} onClick={() => trackClick(featured.id)} className={styles.featuredLink}>
                  <div className={styles.featuredImg}>
                    <BlurImage src={featured.image} blur_image={featured.blur_image} alt={featured.title} />
                    <span className={styles.category}>{featured.category}</span>
                  </div>
                  <div className={styles.featuredBody}>
                    <div className={styles.meta}>
                      <span><Clock size={13} /> {featured.readTime} min read</span>
                      <span>{new Date(featured.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <h2 className={styles.featuredTitle}>{featured.title}</h2>
                    <p className={styles.excerpt}>{featured.excerpt}</p>
                    <span className={styles.readMore}>Read Article <ArrowRight size={14} /></span>
                  </div>
                </Link>
              </motion.div>
            )}

            <div className={styles.sideList}>
              {rest.map((item, i) => (
                <motion.div key={item.id} className={styles.sideCard}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                  <Link to={`/news/${item.slug}`} onClick={() => trackClick(item.id)} className={styles.sideLink}>
                    <div className={styles.sideImg}>
                      <BlurImage src={item.image} blur_image={item.blur_image} alt={item.title} />
                    </div>
                    <div className={styles.sideBody}>
                      <span className={styles.sideCategory}><Tag size={11} /> {item.category}</span>
                      <h3 className={styles.sideTitle}>{item.title}</h3>
                      <span className={styles.sideDate}>{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
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

export default FeaturedNews;
