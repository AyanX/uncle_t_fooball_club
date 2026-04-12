import React from 'react';
import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import styles from './ErrorPage.module.scss';

const ErrorPage: React.FC = () => {
  let message = 'An unexpected error occurred. Please try again.';


  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.iconWrap}>
            <AlertTriangle size={48} />
          </div>

          <h1 className={styles.title}>Something Went Wrong</h1>
          <p className={styles.message}>{message}</p>

          <div className={styles.actions}>
            <Link to="/" className={styles.primaryBtn}>
              <Home size={16} /> Go Home
            </Link>
            <button className={styles.ghostBtn} onClick={() => window.location.reload()}>
              <RefreshCw size={16} /> Try Again
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default ErrorPage;
