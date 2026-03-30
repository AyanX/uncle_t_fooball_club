// Programs/index.tsx — programTitles from context (no standalone fetch)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Leaf, Heart, Palette, Star, BookOpen } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import SectionTitle from '@/components/common/SectionTitle/SectionTitle';
import BlurImage from '@/components/common/BlurImage/BlurImage';
import Loader from '@/components/common/Loader/Loader';
import { useAppContext } from '@/context/AppContext';
import styles from './Programs.module.scss';

const iconMap: Record<string, React.ReactNode> = {
  Trophy: <Trophy size={32} />, Leaf: <Leaf size={32} />, Heart: <Heart size={32} />,
  Palette: <Palette size={32} />, Star: <Star size={32} />, BookOpen: <BookOpen size={32} />,
};

const Programs: React.FC = () => {
  const { programs, programTitles, loading } = useAppContext();
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  const displayed = selectedTitle
    ? programs.filter((p) => p.title === selectedTitle)
    : programs;

  return (
    <main>
      <PageHeader
        eyebrow="Beyond the Pitch"
        title="Our Programmes"
        subtitle="Football is our platform. Community is our purpose. Discover how Kilimanjaro FC is transforming lives."
        image="https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1400"
      />

      <section className={styles.impactBand}>
        <div className={styles.impactContainer}>
          {[{ value: '500K+', label: 'Lives Impacted' }, { value: '6', label: 'Programmes' },
            { value: '12', label: 'Countries' }, { value: '2020', label: 'Founded' }]
            .map((s, i) => (
              <motion.div key={s.label} className={styles.impactStat}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                <span className={styles.impactValue}>{s.value}</span>
                <span className={styles.impactLabel}>{s.label}</span>
              </motion.div>
            ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <SectionTitle eyebrow="Six Pillars" title="Community Programmes" subtitle="Each programme creates lasting, measurable change." />
            {programTitles.length > 0 && (
              <div className={styles.filterWrap}>
                <select className={styles.filterSelect} value={selectedTitle} onChange={(e) => setSelectedTitle(e.target.value)}>
                  <option value="">All Programmes</option>
                  {programTitles.map((t) => <option key={t.id} value={t.title}>{t.title}</option>)}
                </select>
              </div>
            )}
          </div>

          {loading.programs ? <Loader /> : (
            <div className={styles.grid}>
              {displayed.map((prog, i) => (
                <motion.div key={prog.id} className={styles.card}
                  initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                  <div className={styles.cardImg}>
                    <BlurImage src={prog.image} blur_image={prog.blur_image} alt={prog.title} />
                    <div className={styles.imgOverlay} />
                    <div className={styles.iconBadge}>{iconMap[prog.icon]}</div>
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.tagline}>{prog.tagline}</span>
                    <h3 className={styles.title}>{prog.title}</h3>
                    <p className={styles.desc}>{prog.description}</p>
                    <div className={styles.statsRow}>
                      {prog.stats.slice(0, 2).map((s) => (
                        <div key={s.label} className={styles.stat}>
                          <span className={styles.statVal}>{s.value}</span>
                          <span className={styles.statLabel}>{s.label}</span>
                        </div>
                      ))}
                    </div>
                    <Link to={`/programs/${prog.slug}`} className={styles.cta}>
                      Learn More <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={styles.ctaBanner}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <span className={styles.ctaEyebrow}>Get Involved</span>
            <h2 className={styles.ctaTitle}>Partner With Us or Volunteer</h2>
            <p className={styles.ctaText}>Your partnership or donation helps us scale these programmes and reach more communities.</p>
            <div className={styles.ctaBtns}>
              <Link to="/contact" className={styles.ctaBtnPrimary}>Become a Partner <ArrowRight size={16} /></Link>
              <Link to="/volunteer" className={styles.ctaBtnOutline}>Volunteer</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Programs;
