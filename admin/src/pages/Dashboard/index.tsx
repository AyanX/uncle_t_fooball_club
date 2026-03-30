// pages/Dashboard/index.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper, Users, Calendar, Image, Target, Handshake, Trophy, ArrowRight, TrendingUp } from 'lucide-react';
import { useAdminData } from '@/context/AdminDataContext';
import styles from './Dashboard.module.scss';

const Dashboard: React.FC = () => {
  const { players, news, fixtures, gallery, programs, partners, stats, loading } = useAdminData();

  const cards = [
    { label: 'Players',     count: players.length,  icon: <Users size={22} />,     path: '/team',     color: '#0A142F' },
    { label: 'News',        count: news.length,      icon: <Newspaper size={22} />, path: '/news',     color: '#C8102E' },
    { label: 'Fixtures',    count: fixtures.length,  icon: <Calendar size={22} />,  path: '/fixtures', color: '#F1C40F' },
    { label: 'Gallery',     count: gallery.length,   icon: <Image size={22} />,     path: '/gallery',  color: '#0A142F' },
    { label: 'Programmes',  count: programs.length,  icon: <Target size={22} />,    path: '/programs', color: '#C8102E' },
    { label: 'Partners',    count: partners.length,  icon: <Handshake size={22} />, path: '/partners', color: '#F1C40F' },
  ];

  const recentNews   = news.slice(0, 5);
  const upcomingFix  = fixtures.filter(f => f.status === 'upcoming').slice(0, 4);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <span className={styles.pageSub}>Welcome back — here's what's happening at Kilimanjaro FC</span>
      </div>

      {/* Stat cards */}
      <div className={styles.cards}>
        {cards.map((c, i) => (
          <motion.div key={c.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}>
            <Link to={c.path} className={styles.card} style={{ '--card-color': c.color } as any}>
              <div className={styles.cardIcon}>{c.icon}</div>
              <div className={styles.cardInfo}>
                <span className={styles.cardCount}>{loading ? '—' : c.count}</span>
                <span className={styles.cardLabel}>{c.label}</span>
              </div>
              <ArrowRight size={16} className={styles.cardArrow} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Club stats from API */}
      {stats.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Club Statistics</span>
            <Link to="/settings" className={styles.sectionLink}>Manage <ArrowRight size={13} /></Link>
          </div>
          <div className={styles.statsGrid}>
            {stats.map((s) => (
              <div key={s.id} className={styles.statCard}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.twoCol}>
        {/* Recent news */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Recent News</span>
            <Link to="/news" className={styles.sectionLink}>View All <ArrowRight size={13} /></Link>
          </div>
          <div className={styles.list}>
            {recentNews.map(item => (
              <Link key={item.id} to={`/news/${item.id}`} className={styles.listItem}>
                <div className={styles.listImg}>
                  <img src={item.image} alt={item.title} />
                </div>
                <div className={styles.listBody}>
                  <span className={styles.listCat}>{item.category}</span>
                  <p className={styles.listTitle}>{item.title}</p>
                  <span className={styles.listDate}>
                    {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {item.featured && <span className={styles.featuredDot} title="Featured" />}
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming fixtures */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Upcoming Fixtures</span>
            <Link to="/fixtures" className={styles.sectionLink}>View All <ArrowRight size={13} /></Link>
          </div>
          <div className={styles.list}>
            {upcomingFix.length === 0 && <p className={styles.empty}>No upcoming fixtures</p>}
            {upcomingFix.map(f => (
              <div key={f.id} className={styles.fixtureItem}>
                <div className={styles.fixtureComp}>{f.competition}</div>
                <div className={styles.fixtureTeams}>
                  <span className={f.homeTeam === 'Kilimanjaro FC' ? styles.us : ''}>{f.homeTeam}</span>
                  <span className={styles.vs}>VS</span>
                  <span className={f.awayTeam === 'Kilimanjaro FC' ? styles.us : ''}>{f.awayTeam}</span>
                </div>
                <span className={styles.fixtureDate}>
                  {new Date(f.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {f.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
