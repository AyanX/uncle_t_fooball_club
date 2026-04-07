import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import styles from './NotFound.module.scss';

const NotFound: React.FC = () => (
  <main className={styles.page}>
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.number} aria-hidden>404</div>

        <div className={styles.circle} aria-hidden />

        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.subtitle}>
          The page you're looking for has been transferred or doesn't exist. 
          Head back to the home page or explore the club.
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.primaryBtn}>
            <Home size={16} /> Back to Home
          </Link>
          <Link to="/news" className={styles.ghostBtn}>
            <Search size={16} /> Browse News
          </Link>
        </div>
      </motion.div>
    </div>
  </main>
);

export default NotFound;
