// Partners/index.tsx — partnerTiers from context (no standalone fetch)
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import SectionTitle from '@/components/common/SectionTitle/SectionTitle';
import Loader from '@/components/common/Loader/Loader';
import { useAppContext } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import styles from './Partners.module.scss';

const Partners: React.FC = () => {
  const { partners, partnerTiers, loading } = useAppContext();

  return (
    <main>
      <PageHeader
        eyebrow="Commercial"
        title="Partners & Sponsors"
        subtitle="The organisations who share our values and help us compete at the highest level while serving our communities."
        image="https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=1400"
      />

      <section className={styles.section}>
        <div className={styles.container}>
          {loading.partners || loading.meta ? <Loader /> : (
            <>
              {partnerTiers.map((tier) => {
                const tierPartners = partners.filter((p) => p.tier === tier.name);
                if (!tierPartners.length) return null;
                return (
                  <div key={tier.id} className={styles.tierGroup}>
                    <div className={styles.tierHeader}>
                      <Star size={18} className={`${styles.tierIcon} ${styles[tier.name] || ''}`} />
                      <h3 className={styles.tierTitle}>{tier.name.charAt(0).toUpperCase() + tier.name.slice(1)} Partners</h3>
                      <span className={`${styles.tierBadge} ${styles[tier.name] || ''}`}>{tier.name}</span>
                    </div>
                    <div className={styles.grid}>
                      {tierPartners.map((partner, i) => (
                        <motion.div key={partner.id} className={styles.card}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.08 }}>
                          <div className={styles.cardBody}>
                            <div className={styles.nameRow}>
                              <div className={styles.logoArea}>
                                <span className={styles.logoText}>{partner.name.slice(0, 2).toUpperCase()}</span>
                              </div>
                              <div style={{ flex: 1 }}>
                                <h4 className={styles.partnerName}>{partner.name}</h4>
                              </div>
                              {partner.website && (
                                <a href={partner.website} target="_blank" rel="noopener noreferrer"
                                  className={styles.extLink} onClick={(e) => e.stopPropagation()}>
                                  <ExternalLink size={16} className={styles.extIcon} />
                                </a>
                              )}
                            </div>
                            <p className={styles.partnerDesc}>{partner.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </section>

      <section className={styles.joinCta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Become a Partner</h2>
          <p className={styles.ctaText}>Join the growing family of organisations supporting Uncle T FC and transforming lives through sport.</p>
          <Link to="/contact" className={styles.ctaBtn}>Get in Touch</Link>
        </div>
      </section>
    </main>
  );
};

export default Partners;
