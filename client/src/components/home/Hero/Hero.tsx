// Hero.tsx — Full-screen hero with new brand image and colors
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Play, MapPin, Calendar } from 'lucide-react';
import styles from './Hero.module.scss';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=1920';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const Hero: React.FC = () => (
  <section className={styles.hero}>
    {/* Background */}
    <div className={styles.bg}>
      <img src={HERO_IMAGE} alt="Football stadium — Kilimanjaro FC" className={styles.bgImg} />
      <div className={styles.bgOverlay} />
      <div className={styles.bgGradient} />
    </div>

    {/* Pitch deco */}
    <div className={styles.pitchDeco} aria-hidden>
      <div className={styles.halfCircle} />
    </div>

    {/* Main content */}
    <div className={styles.container}>
      <motion.div className={styles.content} variants={container} initial="hidden" animate="show">

        <motion.span className={styles.eyebrow} variants={item}>
          Community-Driven Football Club
        </motion.span>

        <motion.h1 className={styles.headline} variants={item}>
          <span className={styles.headlineWhite}>Where Talent</span>
          <span className={styles.headlineRed}>Meets Opportunity.</span>
        </motion.h1>

        <motion.p className={styles.subheading} variants={item}>
          We are a community-driven football club dedicated to developing young athletes,
          empowering local communities, and building the future of African football through
          discipline, mentorship, and opportunity.
        </motion.p>

        {/* Next match strip */}
        <motion.div className={styles.matchStrip} variants={item}>
          <div className={styles.matchLabel}>
            <Calendar size={13} />
            <span>Wednesday, October 15</span>
          </div>
          <div className={styles.matchInfo}>
            <span className={styles.matchTeams}>Kilimanjaro FC vs City Rovers FC</span>
            <span className={styles.matchMeta}>
              <MapPin size={12} /> Union 7 Arena &bull; Premier League
            </span>
          </div>
        </motion.div>

        <motion.div className={styles.ctas} variants={item}>
          <Link to="/programs" className={styles.btnPrimary}>
            Explore Our Impact <ChevronRight size={18} />
          </Link>
          <Link to="/join" className={styles.btnGold}>
            <Play size={14} fill="currentColor" /> Join the Academy
          </Link>
        </motion.div>
      </motion.div>
    </div>

    {/* Scroll hint */}
    <motion.div
      className={styles.scrollHint}
      animate={{ y: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
    >
      <div className={styles.scrollLine} />
      <span>Scroll</span>
    </motion.div>
  </section>
);

export default Hero;
