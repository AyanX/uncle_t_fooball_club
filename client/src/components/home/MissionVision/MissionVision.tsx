import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Zap, Shield } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import Loader from '@/components/common/Loader/Loader';
import styles from './MissionVision.module.scss';

const iconList = [<Users size={20} />, <Star size={20} />, <Zap size={20} />, <Shield size={20} />];

const imageCards = [
  { label: 'Kids Soccer', image: 'https://ik.imagekit.io/59p9lo9mv/soccer/gettyimages-1620843583-612x612.jpg' },
  { label: 'Youth Empowerment', image: 'https://ik.imagekit.io/59p9lo9mv/soccer/gettyimages-607728198-2048x2048.webp' },
];

const MissionVision: React.FC = () => {
  const { missionVision, loading } = useAppContext();

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div className={styles.left} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <span className={styles.eyebrow}>Who We Are</span>
          <h2 className={styles.title}>Our Mission &amp; Vision</h2>
          <div className={styles.accent} />
          {loading.clubInfo || !missionVision ? <Loader size={40} /> : (
            <div className={styles.pillars}>
              {missionVision.map((item, i) => (
                <motion.div key={item.id} className={styles.pillar} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.15 + i * 0.12 }}>
                  <div className={styles.pillarIcon}>{iconList[i % iconList?.length]}</div>
                  <div className={styles.pillarText}>
                    <h4 className={styles.pillarTitle}>{item.title}</h4>
                    <p className={styles.pillarDesc}>{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div className={styles.right} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
          {imageCards.map((card, i) => (
            <motion.div key={card.label} className={styles.imgCard} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 + i * 0.1 }} whileHover={{ scale: 1.02 }}>
              <img src={card.image} alt={card.label} className={styles.cardImg} />
              <div className={styles.cardOverlay} />
              <span className={styles.cardLabel}>{card.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVision;
