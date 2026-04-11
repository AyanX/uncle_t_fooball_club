import React from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, Star, Shield } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import SectionTitle from '@/components/common/SectionTitle/SectionTitle';
import Stats from '@/components/home/Stats/Stats';
import BlurImage from '@/components/common/BlurImage/BlurImage';
import Loader from '@/components/common/Loader/Loader';
import { useAppContext } from '@/context/AppContext';
import { Helmets } from '@/helmet';
import styles from './About.module.scss';

const iconList = [<Users size={28} />, <Zap size={28} />, <Star size={28} />, <Shield size={28} />];

const About: React.FC = () => {
  const { missionVision, milestones, management, loading } = useAppContext();

  return (
    <main>
      {Helmets.about}
      <PageHeader
        eyebrow="Our Story"
        title="About Uncle T FC"
        subtitle="Born on the slopes of Africa's greatest mountain. Built on community, ambition, and an unshakeable belief in African football."
        image="https://ik.imagekit.io/59p9lo9mv/soccer/steptodown.com195808.jpg"
      />

      <Stats />

      <section className={styles.missionSection}>
        <div className={styles.container}>
          {loading.clubInfo || !missionVision ? <Loader /> : (
            <div className={styles.missionGrid}>
              {missionVision.map((item, i) => (
                <motion.div
                  key={item.id}
                  className={`${styles.missionCard} ${i % 2 === 1 ? styles.visionCard : ''}`}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                >
                  <div className={styles.missionIcon}>{iconList[i % iconList?.length]}</div>
                  <h3 className={styles.missionCardTitle}>{item.title}</h3>
                  <p className={styles.missionCardText}>{item.content}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <SectionTitle eyebrow="History" title="Club Milestones" />
          {loading.clubInfo || !milestones ? <Loader /> : (
            <div className={styles.timeline}>
              {milestones.map((m, i) => (
                <motion.div
                  key={m.id}
                  className={`${styles.timelineItem} ${i % 2 === 0 ? styles.left : styles.right}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div className={styles.timelineContent}>
                    <span className={styles.timelineYear}>{m.year}</span>
                    <h4 className={styles.timelineTitle}>{m.title}</h4>
                    <p className={styles.timelineDesc}>{m.content}</p>
                  </div>
                  <div className={styles.timelineDot} />
                </motion.div>
              ))}
              <div className={styles.timelineLine} />
            </div>
          )}
        </div>
      </section>

      <section className={styles.managementSection}>
        <div className={styles.container}>
          <SectionTitle eyebrow="Leadership" title="Club Management" align="center" />
          {loading.clubInfo || !management ? <Loader /> : (
            <div className={styles.managementGrid}>
              {management.map((person, i) => (
                <motion.div
                  key={person.id}
                  className={styles.personCard}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                >
                  <div className={styles.personImg}>
                    <BlurImage src={person.image} blur_image={person.blur_image} alt={person.name} />
                  </div>
                  <h4 className={styles.personName}>{person.name}</h4>
                  <span className={styles.personRole}>{person.role}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default About;
