import React from 'react';
import { Link, useNavigate, useRouteError } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react';
import styles from './ErrorPage.module.scss';

const ErrorPage: React.FC = () => {
  const navigate  = useNavigate();
  const routeErr  = useRouteError() as any;

  const message = 'An unexpected error occurred.';
  return (
    <div className={styles.page}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.iconWrap}>
          <AlertTriangle size={40} className={styles.icon} />
        </div>

        <div className={styles.code}>{ 'Oops'}</div>
        <h1 className={styles.title}>
          { 'Something Went Wrong'}
        </h1>
        <p className={styles.desc}>{message
        }</p>

        <div className={styles.actions}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Go Back
          </button>
          <button className={styles.refreshBtn} onClick={() => window.location.reload()}>
            <RefreshCw size={16} /> Reload Page
          </button>
          <Link to="/" className={styles.homeBtn}>
            <Home size={16} /> Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
