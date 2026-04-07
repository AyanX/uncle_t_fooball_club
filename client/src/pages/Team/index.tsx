import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Flag } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import SectionTitle from '@/components/common/SectionTitle/SectionTitle';
import BlurImage from '@/components/common/BlurImage/BlurImage';
import Loader from '@/components/common/Loader/Loader';
import { useAppContext } from '@/context/AppContext';
import styles from './Team.module.scss';

type Filter = 'All' | 'First Team' | 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
const POSITIONS: Filter[] = ['All', 'First Team', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

const Team: React.FC = () => {
  const { players, loading } = useAppContext();
  const [filter, setFilter] = useState<Filter>('All');

  const filtered = players.filter((p) => {
    if (filter === 'All') return true;
    if (filter === 'First Team') return p.first_team;
    return p.position === filter;
  });

  return (
    <main>
      <PageHeader
        eyebrow="First Team"
        title="The Squad"
        subtitle="Meet the players who wear the green and gold with pride every matchday."
        image="https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=1400"
      />
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.topRow}>
            <SectionTitle eyebrow="2024/25 Season" title="Full Squad" />
            <div className={styles.filters}>
              {POSITIONS.map((pos) => (
                <button key={pos} className={`${styles.filterBtn} ${filter === pos ? styles.active : ''}`} onClick={() => setFilter(pos)}>
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {loading.players ? <Loader /> : (
            <motion.div layout className={styles.grid}>
              <AnimatePresence>
                {filtered.map((player, i) => (
                  <motion.div key={player.id} layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.35, delay: i * 0.04 }}>
                    <Link to={`/team/${player.slug}`} className={styles.card}>
                      <div className={styles.imgWrap}>
                        <BlurImage src={player.image} blur_image={player.blur_image} alt={player.name} objectPosition="center top" />
                        <div className={styles.numberOverlay}><span className={styles.number}>{player.number}</span></div>
                        <span className={styles.positionBadge}>{player.position}</span>
                        {player.first_team && <span className={styles.firstTeamBadge}>First XI</span>}
                      </div>
                      <div className={styles.info}>
                        <div className={styles.nameRow}>
                          <h3 className={styles.name}>{player.name}</h3>
                          <Flag size={14} className={styles.flagIcon} />
                        </div>
                        <span className={styles.nationality}>{player.nationality}</span>
                        <div className={styles.stats}>
                          <div className={styles.stat}><span className={styles.statVal}>{player.goals}</span><span className={styles.statLabel}>Goals</span></div>
                          <div className={styles.stat}><span className={styles.statVal}>{player.assists}</span><span className={styles.statLabel}>Assists</span></div>
                          <div className={styles.stat}><span className={styles.statVal}>{player.appearances}</span><span className={styles.statLabel}>Apps</span></div>
                        </div>
                        <span className={styles.viewProfile}>View Profile <ArrowRight size={13} /></span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Team;
