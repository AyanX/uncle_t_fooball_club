import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import { Fixture } from '@/data/dummyData';
import Loader from '@/components/common/Loader/Loader';
import SectionTitle from '@/components/common/SectionTitle/SectionTitle';
import styles from './UpcomingFixtures.module.scss';

interface Props { fixtures: Fixture[]; loading: boolean; teamName: {
    id: number;
    name: string;
}; }

const UpcomingFixtures: React.FC<Props> = ({ fixtures, loading, teamName }) => {
  const upcoming = fixtures.filter((f) => f.status === 'upcoming').slice(0, 3);
  const recent   = fixtures.filter((f) => f.status === 'completed').slice(0, 2);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <SectionTitle
            eyebrow="Schedule"
            title="Fixtures & Results"
            light
          />
          <Link to="/fixtures" className={styles.seeAll}>
            Full Schedule <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <Loader color="#C9A84C" />
        ) : (
          <div className={styles.grid}>
            {/* Upcoming */}
            <div className={styles.col}>
              <h3 className={styles.colLabel}>Upcoming</h3>
              <div className={styles.list}>
                {upcoming.map((f, i) => (
                  <motion.div
                    key={f.id}
                    className={styles.card}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <span className={styles.comp}>{f.competition}</span>
                    <div className={styles.matchup}>
                      <span className={`${styles.team} ${f.homeTeam.toLowerCase().trim() === teamName.name?.toLowerCase().trim() ? styles.us : ''}`}>
                        {f.homeTeam}
                      </span>
                      <span className={styles.vs}>VS</span>
                      <span className={`${styles.team} ${f.awayTeam.toLowerCase().trim() === teamName.name?.toLowerCase().trim() ? styles.us : ''}`}>
                        {f.awayTeam}
                      </span>
                    </div>
                    <div className={styles.details}>
                      <span><Clock size={13} />
                        {new Date(f.date).toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' })} — {f.time}
                      </span>
                      <span><MapPin size={13} /> {f.venue.split(',')[0]}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent results */}
            <div className={styles.col}>
              <h3 className={styles.colLabel}>Recent Results</h3>
              <div className={styles.list}>
                {recent.map((f, i) => {
                  const won = (f.homeTeam.toLowerCase().trim() === teamName.name?.toLowerCase().trim()  && (f.homeScore ?? 0) > (f.awayScore ?? 0))
                    || (f.awayTeam.toLowerCase().trim() === teamName.name?.toLowerCase().trim() && (f.awayScore ?? 0) > (f.homeScore ?? 0));
                  const drew = f.homeScore === f.awayScore;
                  return (
                    <motion.div
                      key={f.id}
                      className={styles.card}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                    >
                      <div className={styles.resultHeader}>
                        <span className={styles.comp}>{f.competition}</span>
                        <span className={`${styles.resultBadge} ${won ? styles.win : drew ? styles.draw : styles.loss}`}>
                          {won ? 'W' : drew ? 'D' : 'L'}
                        </span>
                      </div>
                      <div className={styles.matchup}>
                        <span className={`${styles.team} ${f.homeTeam.toLowerCase().trim() === teamName.name?.toLowerCase().trim() ? styles.us : ''}`}>
                          {f.homeTeam}
                        </span>
                        <span className={styles.score}>{f.homeScore} – {f.awayScore}</span>
                        <span className={`${styles.team} ${f.awayTeam.toLowerCase().trim() === teamName.name?.toLowerCase().trim() ? styles.us : ''}`}>
                          {f.awayTeam}
                        </span>
                      </div>
                      <div className={styles.details}>
                        <span><MapPin size={13} /> {f.venue.split(',')[0]}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingFixtures;
