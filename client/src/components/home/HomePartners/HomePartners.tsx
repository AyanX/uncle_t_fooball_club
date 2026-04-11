import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Partner } from '@/data/dummyData';
import styles from './HomePartners.module.scss';
import PuffLoaderSpinner from '@/components/common/puffLoader/PuffLoader';

interface Props { partners: Partner[]; loading: boolean; }

const HomePartners: React.FC<Props> = ({ partners }) => (
  <section className={styles.section}>
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Trusted By</span>
        <h2 className={styles.title}>Our Partners & Sponsors</h2>
        <Link to="/partners" className={styles.link}>
          View All Partners <ArrowRight size={14} />
        </Link>
      </div>

      <div className={styles.logoGrid}>
        {partners ? (  partners.map((p, i) => (
          <motion.a
            key={p.id}
            href={p.website}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.logoCard} ${styles[p.tier]}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            whileHover={{ y: -3 }}
            title={p.name}
          >
            <span className={styles.logoName}>{p.name}</span>
            <span className={styles.tierBadge}>{p.tier}</span>
          </motion.a>
        ))     ) :( <PuffLoaderSpinner />)}
      </div>
    </div>
  </section>
);

export default HomePartners;
