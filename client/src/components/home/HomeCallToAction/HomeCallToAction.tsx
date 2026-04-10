import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './HomeCallToAction.module.scss';

const HomeCallToAction: React.FC = () => (
  <section className={styles.section}>
    <div className={styles.bg} aria-hidden />
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.eyebrow}>Trusted by our community</span>
        <h2 className={styles.title}>
          Ready to Make a<br />
          <span className={styles.titleGold}>Difference?</span>
        </h2>
        <p className={styles.sub}>Building the Future of African Football.</p>
        <p className={styles.desc}>
          Join Uncle T FC as a player, volunteer, or partner and be part of a movement
          shaping lives through sport.
        </p>
        <div className={styles.btns}>
          <Link to="/contact"    className={styles.btnPrimary}>Join the Academy</Link>
          <Link to="/contact" className={styles.btnOutline}>Support the Club</Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HomeCallToAction;
