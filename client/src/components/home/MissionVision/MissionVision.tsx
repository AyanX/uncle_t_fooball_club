// MissionVision.tsx — Mission & Vision fetched from context (api /club/mission)
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Zap, Shield } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import Loader from '@/components/common/Loader/Loader';
import styles from './MissionVision.module.scss';

const iconList = [<Users size={20} />, <Star size={20} />, <Zap size={20} />, <Shield size={20} />];

const imageCards = [
  { label: 'Community Action', image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { label: 'Youth Empowerment', image: 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { label: 'Safe Spaces', image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=600' },
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
          {loading.clubInfo ? <Loader size={40} /> : (
            <div className={styles.pillars}>
              {missionVision.map((item, i) => (
                <motion.div key={item.id} className={styles.pillar} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.15 + i * 0.12 }}>
                  <div className={styles.pillarIcon}>{iconList[i % iconList.length]}</div>
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
