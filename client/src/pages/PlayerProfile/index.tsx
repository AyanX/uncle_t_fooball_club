// PlayerProfile/index.tsx — Fetch player by numeric id; show 3 related players
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Flag, Twitter, Instagram, ArrowRight } from 'lucide-react';
import { api } from '@/services/api';
import { Player } from '@/data/dummyData';
import { useAppContext } from '@/context/AppContext';
import BlurImage from '@/components/common/BlurImage/BlurImage';
import Loader from '@/components/common/Loader/Loader';
import styles from './PlayerProfile.module.scss';

// Small card shown in the "Other Players" strip at the bottom
const RelatedPlayerCard: React.FC<{ player: Player }> = ({ player }) => (
  <motion.div
    whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.18)' }}
    transition={{ duration: 0.22 }}
  >
    <Link to={`/team/${player.slug}`} className={styles.relCard}>
      <div className={styles.relImg}>
        <BlurImage src={player.image} blur_image={player.blur_image} alt={player.name} objectPosition="center top" />
        <span className={styles.relNumber}>#{player.number}</span>
      </div>
      <div className={styles.relBody}>
        <span className={styles.relPos}>{player.position}</span>
        <h4 className={styles.relName}>{player.name}</h4>
        <span className={styles.relNat}>{player.nationality}</span>
      </div>
      <ArrowRight size={16} className={styles.relArrow} />
    </Link>
  </motion.div>
);

const PlayerProfile: React.FC = () => {
  const { player_name } = useParams<{ player_name: string }>();
  const navigate = useNavigate();
  const { players } = useAppContext();           // full list from context
  const [player, setPlayer] = useState<Player | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!player_name) return;
    setLoading(true);

    // First look up by slug in context to get the numeric id
    const found = players.find((p) => p.slug === player_name);
    if (found) {
      // Fetch by numeric id
      api.get.player(found.id).then((p) => {
        setPlayer(p ?? found);   // fallback to context data if API fails
        setLoading(false);
      });
    } else {
      // Not yet in context — try to infer id from dummy data
      setPlayer(undefined);
      setLoading(false);
      navigate('/404', { replace: true });
    }
  }, [player_name, players, navigate]);

  // 3 related players — different position or random, excluding current
  const related = players
    .filter((p) => p.slug !== player_name)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  if (loading) return <Loader fullHeight />;
  if (!player) return null;

  const statItems = [
    { label: 'Goals',       value: player.goals },
    { label: 'Assists',     value: player.assists },
    { label: 'Appearances', value: player.appearances },
    { label: 'Age',         value: player.age },
    { label: 'Jersey No.',  value: `#${player.number}` },
  ];

  return (
    <main className={styles.page}>
      {/* Back button */}
      <div className={styles.backWrap}>
        <div className={styles.container}>
          <Link to="/team" className={styles.backBtn}>
            <ArrowLeft size={16} /> Back to Squad
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.container}>
          <div className={styles.heroInner}>
            {/* Player image — fade-up on mobile, slide-left on desktop */}
            <motion.div
              className={styles.playerImg}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <BlurImage src={player.image} blur_image={player.blur_image} alt={player.name} objectPosition="center top" />
              <div className={styles.jerseyBadge}><span>{player.number}</span></div>
            </motion.div>

            {/* Player info */}
            <motion.div
              className={styles.playerInfo}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <span className={styles.position}>{player.position}</span>
              <h1 className={styles.name}>{player.name}</h1>
              <div className={styles.meta}>
                <span className={styles.metaItem}><Flag size={14} /> {player.nationality}</span>
                <span className={styles.metaItem}>Age {player.age}</span>
                {player.first_team && <span className={styles.firstTeamTag}>First Team</span>}
              </div>

              <div className={styles.statsRow}>
                {statItems.map((s) => (
                  <div key={s.label} className={styles.statBox}>
                    <span className={styles.statValue}>{s.value}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </div>
                ))}
              </div>

              {player.social && (
                <div className={styles.socials}>
                  {player.social.twitter && (
                    <a href={`https://twitter.com/${player.social.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                      <Twitter size={16} /> {player.social.twitter}
                    </a>
                  )}
                  {player.social.instagram && (
                    <a href={`https://instagram.com/${player.social.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                      <Instagram size={16} /> {player.social.instagram}
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bio + season stats */}
      <section className={styles.bioSection}>
        <div className={styles.container}>
          <motion.div className={styles.bioCard} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className={styles.bioTitle}>Player Profile</h2>
            <div className={styles.bioAccent} />
            <p className={styles.bioText}>{player.bio}</p>
          </motion.div>

          <motion.div className={styles.seasonStats} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h3 className={styles.seasonTitle}>2024/25 Season Statistics</h3>
            <div className={styles.statBars}>
              {[
                { label: 'Goals',       value: player.goals,       max: 30 },
                { label: 'Assists',     value: player.assists,     max: 20 },
                { label: 'Appearances', value: player.appearances, max: 38 },
              ].map((bar) => (
                <div key={bar.label} className={styles.barItem}>
                  <div className={styles.barHeader}>
                    <span className={styles.barLabel}>{bar.label}</span>
                    <span className={styles.barValue}>{bar.value}</span>
                  </div>
                  <div className={styles.barTrack}>
                    <motion.div
                      className={styles.barFill}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min((bar.value / bar.max) * 100, 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related players strip */}
      {related.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.container}>
            <h3 className={styles.relatedHeading}>More Players</h3>
            <div className={styles.relatedGrid}>
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <RelatedPlayerCard player={p} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default PlayerProfile;
