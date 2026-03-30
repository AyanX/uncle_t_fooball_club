// PageHeader.tsx — Hero banner for interior pages
import React from 'react';
import { motion } from 'framer-motion';
import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, subtitle, image }) => (
  <section
    className={styles.header}
    style={image ? { backgroundImage: `url(${image})` } : undefined}
  >
    <div className={styles.overlay} />
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </motion.div>
    </div>
    {/* Decorative pitch lines */}
    <div className={styles.lines}>
      <div className={styles.lineH} />
      <div className={styles.circle} />
    </div>
  </section>
);

export default PageHeader;
