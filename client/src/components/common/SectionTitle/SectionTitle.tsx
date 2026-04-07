import React from 'react';
import { motion } from 'framer-motion';
import styles from './SectionTitle.module.scss';

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  light?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  eyebrow, title, subtitle, align = 'left', light = false,
}) => (
  <motion.div
    className={`${styles.wrapper} ${styles[align]} ${light ? styles.light : ''}`}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
    <h2 className={styles.title}>{title}</h2>
    <div className={styles.accent} />
    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
  </motion.div>
);

export default SectionTitle;
