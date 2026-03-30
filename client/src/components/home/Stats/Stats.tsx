// Stats.tsx — Club statistics fetched from API via context
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, Globe } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import Loader from '@/components/common/Loader/Loader';
import styles from './Stats.module.scss';

const iconMap: Record<string, React.ReactNode> = {
  Trophy:   <Trophy  size={28} />,
  Calendar: <Calendar size={28} />,
  Users:    <Users   size={28} />,
  Globe:    <Globe   size={28} />,
};

const Stats: React.FC = () => {
  const { stats, loading } = useAppContext();

  if (loading.clubInfo) return <Loader />;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {stats.map((stat, i) => (
          <motion.div key={stat.id} className={styles.card} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} whileHover={{ y: -4 }}>
            <div className={styles.icon}>{iconMap[stat.icon] ?? <Trophy size={28} />}</div>
            <span className={styles.value}>{stat.value}</span>
            <span className={styles.label}>{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
