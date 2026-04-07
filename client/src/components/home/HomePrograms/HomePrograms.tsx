import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Leaf, Heart, Palette, Star, BookOpen } from 'lucide-react';
import { Program } from '@/data/dummyData';
import BlurImage from '@/components/common/BlurImage/BlurImage';
import Loader from '@/components/common/Loader/Loader';
import styles from './HomePrograms.module.scss';

interface Props { programs: Program[]; loading: boolean; }

const iconMap: Record<string, React.ReactNode> = {
  Leaf:     <Leaf size={28} />,
  Heart:    <Heart size={28} />,
  Palette:  <Palette size={28} />,
  Star:     <Star size={28} />,
  BookOpen: <BookOpen size={28} />,
};

const HomePrograms: React.FC<Props> = ({ programs, loading }) => {
  const sports     = programs[0];
  const enviro     = programs[1];
  const health     = programs[2];
  const arts       = programs[3];
  const leadership = programs[4];
  const libraries  = programs[5];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>Beyond the Pitch</span>
            <h2 className={styles.title}>
              Comprehensive <span className={styles.titleAccent}>Youth Programs</span>
            </h2>
          </div>
          <Link to="/programs" className={styles.seeAll}>
            View All <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? <Loader /> : (
          <div className={styles.bento}>

            {sports && (
              <motion.div
                className={`${styles.card} ${styles.cardFeatured}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link to={`/programs/${sports.slug}`} className={styles.featuredLink}>
                  <div className={styles.featuredBg}>
                    <BlurImage src={sports.image} blur_image={sports.blur_image} alt={sports.title} />
                    <div className={styles.featuredOverlay} />
                  </div>
                  <div className={styles.featuredContent}>
                    <div className={styles.featuredIconWrap}>
                      <span className={styles.featuredIconEmoji}>🏆</span>
                    </div>
                    <h3 className={styles.featuredTitle}>{sports.title}</h3>
                    <p className={styles.featuredDesc}>{sports.description}</p>
                    <ul className={styles.checkList}>
                      {sports.highlights.slice(0, 3).map((h) => (
                        <li key={h}>
                          <CheckCircle size={14} className={styles.checkIcon} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                    <span className={styles.featuredCta}>
                      Learn More <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )}

            <div className={styles.rightCol}>
              {[enviro, health].map((prog, i) =>
                prog ? (
                  <motion.div
                    key={prog.id}
                    className={`${styles.card} ${styles.cardDark}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.1 + i * 0.1 }}
                  >
                    <Link to={`/programs/${prog.slug}`} className={styles.darkLink}>
                      <div className={styles.darkIcon}>{iconMap[prog.icon]}</div>
                      <h4 className={styles.darkTitle}>{prog.title}</h4>
                      <p className={styles.darkDesc}>{prog.description}</p>
                      <span className={styles.darkCta}>
                        <ArrowRight size={14} />
                      </span>
                    </Link>
                  </motion.div>
                ) : null
              )}
            </div>

            {arts && (
              <motion.div
                className={`${styles.card} ${styles.cardLight}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.2 }}
              >
                <Link to={`/programs/${arts.slug}`} className={styles.lightLink}>
                  <div className={styles.lightIcon}>{iconMap[arts.icon]}</div>
                  <h4 className={styles.lightTitle}>{arts.title}</h4>
                  <p className={styles.lightDesc}>{arts.description}</p>
                </Link>
              </motion.div>
            )}

            {leadership && (
              <motion.div
                className={`${styles.card} ${styles.cardRed}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.25 }}
              >
                <Link to={`/programs/${leadership.slug}`} className={styles.redLink}>
                  <div className={styles.redIcon}>{iconMap[leadership.icon]}</div>
                  <h4 className={styles.redTitle}>{leadership.title}</h4>
                  <p className={styles.redDesc}>{leadership.description}</p>
                  <span className={styles.redCta}>
                    Learn More <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            )}

            {libraries && (
              <motion.div
                className={`${styles.card} ${styles.cardLibrary}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.3 }}
              >
                <Link to={`/programs/${libraries.slug}`} className={styles.libraryLink}>
                  <div className={styles.libraryIcon}>{iconMap[libraries.icon]}</div>
                  <h4 className={styles.libraryTitle}>{libraries.title}</h4>
                  <p className={styles.libraryDesc}>{libraries.description}</p>
                </Link>
              </motion.div>
            )}

          </div>
        )}
      </div>
    </section>
  );
};

export default HomePrograms;
