import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import SectionTitle from '@/components/common/SectionTitle/SectionTitle';
import Loader from '@/components/common/Loader/Loader';
import { useAppContext } from '@/context/AppContext';
import { Fixture } from '@/data/dummyData';
import styles from './Fixtures.module.scss';

type Tab = 'upcoming' | 'completed';

const FixtureRow: React.FC<{ fixture: Fixture; index: number }> = ({ fixture, index }) => {
  const isKFC = (t: string) => t === 'Uncle T FC';
  const won =
    (isKFC(fixture.homeTeam) && (fixture.homeScore ?? 0) > (fixture.awayScore ?? 0)) ||
    (isKFC(fixture.awayTeam) && (fixture.awayScore ?? 0) > (fixture.homeScore ?? 0));
  const drew = fixture.homeScore === fixture.awayScore;

  return (
    <motion.div className={styles.row} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.38, delay: index * 0.06 }}>
      <span className={styles.comp}>{fixture.competition}</span>

      <div className={styles.matchup}>
        <span className={`${styles.team} ${styles.home} ${isKFC(fixture.homeTeam) ? styles.us : ''}`}>{fixture.homeTeam}</span>
        <div className={styles.scoreWrap}>
          {fixture.status === 'completed' ? (
            <>
              <span className={styles.scoreNum}>{fixture.homeScore}</span>
              <span className={styles.scoreSep}>–</span>
              <span className={styles.scoreNum}>{fixture.awayScore}</span>
              <span className={`${styles.resultTag} ${won ? styles.win : drew ? styles.draw : styles.loss}`}>
                {won ? 'W' : drew ? 'D' : 'L'}
              </span>
            </>
          ) : (
            <span className={styles.vs}>VS</span>
          )}
        </div>
        <span className={`${styles.team} ${styles.away} ${isKFC(fixture.awayTeam) ? styles.us : ''}`}>{fixture.awayTeam}</span>
      </div>

      <div className={styles.details}>
        <span className={styles.detailItem}>
          <Calendar size={13} />
          {new Date(fixture.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
        {fixture.time && (
          <span className={styles.detailItem}><Clock size={13} /> {fixture.time}</span>
        )}
        <span className={styles.detailItem}><MapPin size={13} /> {fixture.venue}</span>
        {fixture.status === 'completed' && fixture.fans > 0 && (
          <span className={`${styles.detailItem} ${styles.fans}`}>
            <Users size={13} /> {fixture.fans.toLocaleString()} fans attended
          </span>
        )}
      </div>
    </motion.div>
  );
};

const Fixtures: React.FC = () => {
  const { fixtures, loading } = useAppContext();
  const [tab, setTab] = useState<Tab>('upcoming');

  const upcoming  = fixtures.filter((f) => f.status === 'upcoming');
  const completed = fixtures.filter((f) => f.status === 'completed');
  const displayed = tab === 'upcoming' ? upcoming : completed;

  return (
    <main>
      <PageHeader
        eyebrow="Schedule"
        title="Fixtures & Results"
        subtitle="All upcoming matches and recent results for Uncle T FC across all competitions."
        image="https://images.pexels.com/photos/1366913/pexels-photo-1366913.jpeg?auto=compress&cs=tinysrgb&w=1400"
      />
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.topRow}>
            <SectionTitle eyebrow="2024/25 Season" title="Match Schedule" />
            <div className={styles.tabs}>
              <button className={`${styles.tab} ${tab === 'upcoming' ? styles.active : ''}`} onClick={() => setTab('upcoming')}>
                Upcoming ({upcoming.length})
              </button>
              <button className={`${styles.tab} ${tab === 'completed' ? styles.active : ''}`} onClick={() => setTab('completed')}>
                Results ({completed.length})
              </button>
            </div>
          </div>

          {loading.fixtures ? <Loader /> : (
            <div className={styles.list}>
              {displayed.length === 0 ? (
                <p className={styles.empty}>No fixtures to display.</p>
              ) : (
                displayed.map((f, i) => <FixtureRow key={f.id} fixture={f} index={i} />)
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Fixtures;
