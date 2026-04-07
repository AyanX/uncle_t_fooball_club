import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Tag, Calendar, User } from 'lucide-react';
import { api } from '@/services/api';
import { NewsItem } from '@/data/dummyData';
import BlurImage from '@/components/common/BlurImage/BlurImage';
import Loader from '@/components/common/Loader/Loader';
import { useAppContext } from '@/context/AppContext';
import styles from './NewsArticle.module.scss';

const NewsArticle: React.FC = () => {
  const { slug }    = useParams<{ slug: string }>();
  const navigate    = useNavigate();
  const { news, newsCategories, trackClick } = useAppContext();

  const [article, setArticle] = useState<NewsItem | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get.newsItem(slug).then((item) => {
      setArticle(item);
      setLoading(false);
      if (!item) navigate('/404', { replace: true });
      if (item) trackClick(item.id);
    });
  }, [slug, navigate, trackClick]);

  const related = news.filter((n) => n.slug !== slug).slice(0, 3);
  const categoryData = newsCategories.find((c) => c.category === article?.category);
  const heroImage = categoryData?.image || article?.image || '';

  if (loading) return <Loader fullHeight />;
  if (!article) return null;

  return (
    <main className={styles.page}>
      <div className={styles.backBand}>
        <div className={styles.container}>
          <Link to="/news" className={styles.backBtn}><ArrowLeft size={16} /> Back to News</Link>
        </div>
      </div>

      <div className={styles.heroImg} style={{ backgroundImage: `url(${heroImage})` }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroTitleWrap}>
          <div className={styles.container}>
            <motion.span className={styles.heroCat} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {article.category}
            </motion.span>
            <motion.h1 className={styles.heroTitle} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              {article.title}
            </motion.h1>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.layout}>
            <motion.article className={styles.article} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className={styles.meta}>
                <span className={styles.metaItem}><User size={13} /> {article.author}</span>
                <span className={styles.metaItem}><Calendar size={13} /> {new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className={styles.metaItem}><Clock size={13} /> {article.readTime} min read</span>
              </div>
              <p className={styles.excerpt}>{article.excerpt}</p>
              <div className={styles.articleImg}>
                <BlurImage src={article.image} blur_image={article.blur_image} alt={article.title} />
              </div>
              <div className={styles.content} dangerouslySetInnerHTML={{ __html: article.content }} />
            </motion.article>

            <aside className={styles.sidebar}>
              <h3 className={styles.sidebarTitle}>More Stories</h3>
              <div className={styles.relatedList}>
                {related.map((item) => (
                  <Link key={item.id} to={`/news/${item.slug}`} onClick={() => trackClick(item.id)} className={styles.relatedCard}>
                    <div className={styles.relatedImg}><BlurImage src={item.image} blur_image={item.blur_image} alt={item.title} /></div>
                    <div className={styles.relatedBody}>
                      <span className={styles.relatedCat}><Tag size={11} /> {item.category}</span>
                      <h4 className={styles.relatedTitle}>{item.title}</h4>
                      <span className={styles.relatedDate}>{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NewsArticle;
