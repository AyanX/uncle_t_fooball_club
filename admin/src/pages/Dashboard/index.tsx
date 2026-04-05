// Dashboard/index.tsx — responsive overview with news views section
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper, Users, Calendar, Image, Target, Handshake, ArrowRight, TrendingUp, Eye } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import BlurImage from '@/components/ui/BlurImage';
import styles from './Dashboard.module.scss';

const Dashboard: React.FC = () => {
  const { players, news, fixtures, gallery, programs, partners, stats, newsViews, loading } = useAdminData();

  const statCards = [
    { label: 'Players',    count: players.length,  icon: <Users size={20} />,     path: '/team',     color: '#0A142F' },
    { label: 'News',       count: news.length,      icon: <Newspaper size={20} />, path: '/news',     color: '#C8102E' },
    { label: 'Fixtures',   count: fixtures.length,  icon: <Calendar size={20} />,  path: '/fixtures', color: '#F1C40F' },
    { label: 'Gallery',    count: gallery.length,   icon: <Image size={20} />,     path: '/gallery',  color: '#16a34a' },
    { label: 'Programmes', count: programs.length,  icon: <Target size={20} />,    path: '/programs', color: '#7c3aed' },
    { label: 'Partners',   count: partners.length,  icon: <Handshake size={20} />, path: '/partners', color: '#0891b2' },
  ];

  // News with view counts, sorted highest first
  const newsWithViews = news
    .map(n => ({ ...n, viewCount: newsViews.find(v => v.newsId === n.id)?.views ?? 0 }))
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 6);

  const recentNews  = [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const upcomingFix = fixtures.filter(f => f.status === 'upcoming').slice(0, 4);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSub}>Welcome back — here's your Kilimanjaro FC overview</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className={styles.statCards}>
        {statCards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.06 }}>
            <Link to={c.path} className={styles.statCard} style={{ '--cc': c.color } as any}>
              <div className={styles.statIcon}>{c.icon}</div>
              <div className={styles.statInfo}>
                <span className={styles.statCount}>{loading ? '—' : c.count}</span>
                <span className={styles.statLabel}>{c.label}</span>
              </div>
              <ArrowRight size={15} className={styles.statArrow} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Club stats band */}
      {stats.length > 0 && (
        <div className={styles.clubStats}>
          {stats.map(s => (
            <div key={s.id} className={styles.clubStatItem}>
              <span className={styles.clubStatVal}>{s.value}</span>
              <span className={styles.clubStatLbl}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* News views — sorted by highest */}
      <div className={styles.section}>
        <div className={styles.secHead}>
          <div className={styles.secTitleRow}>
            <TrendingUp size={16} className={styles.secIcon} />
            <span className={styles.secTitle}>Top News by Views</span>
          </div>
          <Link to="/news" className={styles.secLink}>All News <ArrowRight size={13} /></Link>
        </div>
        <div className={styles.viewsList}>
          {loading && <div className={styles.skeleton} style={{ height: 200 }} />}
          {!loading && newsWithViews.map((item, i) => (
            <Link key={item.id} to={`/news/${encodeURIComponent(item.title)}`} className={styles.viewRow}>
              <span className={styles.viewRank}>#{i + 1}</span>
              <div className={styles.viewThumb}>
                {item.image && <BlurImage src={item.image} blurSrc={(item as any).blur_image||undefined} alt={item.title}/>}
              </div>
              <div className={styles.viewBody}>
                <span className={styles.viewCat}>{item.category}</span>
                <p className={styles.viewTitle}>{item.title}</p>
              </div>
              <div className={styles.viewCount}>
                <Eye size={13} />
                <span>{item.viewCount.toLocaleString()}</span>
              </div>
              <div className={styles.viewBar}>
                <div className={styles.viewBarFill} style={{ width: `${Math.min((item.viewCount / (newsWithViews[0]?.viewCount || 1)) * 100, 100)}%` }} />
              </div>
            </Link>
          ))}
          {!loading && newsWithViews.length === 0 && <p className={styles.empty}>No view data yet</p>}
        </div>
      </div>

      {/* Two-col: recent news + upcoming fixtures */}
      <div className={styles.twoCol}>
        <div className={styles.section}>
          <div className={styles.secHead}>
            <span className={styles.secTitle}>Recent News</span>
            <Link to="/news" className={styles.secLink}>View All <ArrowRight size={13} /></Link>
          </div>
          <div className={styles.newsList}>
            {loading && <div className={styles.skeleton} style={{ height: 180 }} />}
            {!loading && recentNews.map(item => (
              <Link key={item.id} to={`/news/${encodeURIComponent(item.title)}`} className={styles.newsRow}>
                <div className={styles.newsThumb}>{item.image && <BlurImage src={item.image} blurSrc={(item as any).blur_image||undefined} alt={item.title}/>}</div>
                <div className={styles.newsBody}>
                  <span className={styles.newsCat}>{item.category}</span>
                  <p className={styles.newsTitle}>{item.title}</p>
                  <span className={styles.newsDate}>{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                {item.featured && <span className={styles.featuredDot} title="Featured" />}
              </Link>
            ))}
            {!loading && recentNews.length === 0 && <p className={styles.empty}>No news yet</p>}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.secHead}>
            <span className={styles.secTitle}>Upcoming Fixtures</span>
            <Link to="/fixtures" className={styles.secLink}>View All <ArrowRight size={13} /></Link>
          </div>
          <div className={styles.fixtureList}>
            {loading && <div className={styles.skeleton} style={{ height: 180 }} />}
            {!loading && upcomingFix.map(f => (
              <div key={f.id} className={styles.fixtureRow}>
                <span className={styles.fixComp}>{f.competition}</span>
                <div className={styles.fixTeams}>
                  <span className={f.homeTeam === 'Kilimanjaro FC' ? styles.us : styles.team}>{f.homeTeam}</span>
                  <span className={styles.vs}>VS</span>
                  <span className={f.awayTeam === 'Kilimanjaro FC' ? styles.us : styles.team}>{f.awayTeam}</span>
                </div>
                <span className={styles.fixDate}>
                  {new Date(f.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {f.time}
                </span>
              </div>
            ))}
            {!loading && upcomingFix.length === 0 && <p className={styles.empty}>No upcoming fixtures</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
