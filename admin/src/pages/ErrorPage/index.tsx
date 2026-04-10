import React from 'react';
import { Link, useNavigate, useRouteError } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react';
import styles from './ErrorPage.module.scss';

const ErrorPage: React.FC = () => {
  const navigate  = useNavigate();
  const routeErr  = useRouteError() as any;

  const message = routeErr?.statusText
    || routeErr?.message
    || 'An unexpected error occurred.';

  const is404 = routeErr?.status === 404;

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

        <div className={styles.code}>{is404 ? '404' : 'Oops'}</div>
        <h1 className={styles.title}>
          {is404 ? 'Page Not Found' : 'Something Went Wrong'}
        </h1>
        <p className={styles.desc}>{is404
          ? "The admin page you're looking for doesn't exist or has been moved."
          : message
        }</p>

        {!is404 && routeErr?.stack && (
          <details className={styles.details}>
            <summary className={styles.summary}>Technical details</summary>
            <pre className={styles.stack}>{routeErr.stack}</pre>
          </details>
        )}

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
