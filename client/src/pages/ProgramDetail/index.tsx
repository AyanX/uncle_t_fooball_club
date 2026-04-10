import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Trophy, Leaf, Heart, Palette, Star, BookOpen } from 'lucide-react';
import { api } from '@/services/api';
import { Program } from '@/data/dummyData';
import { Helmets } from '@/helmet';
import BlurImage from '@/components/common/BlurImage/BlurImage';
import Loader from '@/components/common/Loader/Loader';
import styles from './ProgramDetail.module.scss';

const iconMap: Record<string, React.ReactNode> = {
  Trophy:   <Trophy size={36} />,
  Leaf:     <Leaf size={36} />,
  Heart:    <Heart size={36} />,
  Palette:  <Palette size={36} />,
  Star:     <Star size={36} />,
  BookOpen: <BookOpen size={36} />,
};

const ProgramDetail: React.FC = () => {
  const { slug }   = useParams<{ slug: string }>();
  const navigate   = useNavigate();
  const [program, setProgram] = useState<Program | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get.program(slug).then((p) => {
      setProgram(p);
      setLoading(false);
      if (!p) navigate('/404', { replace: true });
    });
  }, [slug, navigate]);




  if (loading) return <Loader fullHeight />;
  if (!program)  return null;

  const getIcon = (iconName?: string) => {
  if (iconName && iconMap[iconName]) {
    return iconMap[iconName];
  }

  // fallback random icon
  const icons = Object.values(iconMap);
  const randomIndex = Math.floor(Math.random() * icons.length);

  return icons[randomIndex];
};

  return (
    <main className={styles.page}>
      {Helmets.programs}
      {/* Back nav */}
      <div className={styles.backBand}>
        <div className={styles.container}>
          <Link to="/programs" className={styles.backBtn}>
            <ArrowLeft size={16} /> All Programmes
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section
        className={styles.hero}
        style={{ '--prog-color': program.color } as React.CSSProperties}
      >
        <div className={styles.heroBg}>
          <BlurImage src={program.image} blur_image={program.blur_image} alt={program.title} />
        </div>
        <div className={styles.heroOverlay} />

        <div className={styles.container}>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.iconWrap}>{getIcon(program.icon)}</div>
            <span className={styles.eyebrow}>{program.tagline}</span>
            <h1 className={styles.title}>{program.title}</h1>
            <p className={styles.subtitle}>{program.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Stats band */}
      <section
        className={styles.statsBand}
        style={{ '--prog-color': program.color } as React.CSSProperties}
      >
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {program.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className={styles.statBox}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Description + highlights */}
      <section className={styles.bodySection}>
        <div className={styles.container}>
          <div className={styles.bodyGrid}>
            {/* Long description */}
            <motion.div
              className={styles.description}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <h2 className={styles.sectionHeading}>About the Programme</h2>
              <div className={styles.descAccent} />
              <p className={styles.descText}>{program.longDescription}</p>
            </motion.div>

            {/* Highlights */}
            <motion.div
              className={styles.highlights}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <h3 className={styles.highlightsTitle}>Key Highlights</h3>
              <ul className={styles.highlightsList}>
                {program.highlights.map((h) => (
                  <li key={h} className={styles.highlightItem}>
                    <CheckCircle
                      size={20}
                      className={styles.checkIcon}
                      style={{ color: program.color }}
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <Link to="/contact" className={styles.ctaBtn}>
                Get Involved
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProgramDetail;
