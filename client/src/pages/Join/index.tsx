// Join/index.tsx — Membership sign-up page
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, Shield, Zap } from 'lucide-react';
import { api } from '@/services/api';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import styles from './Join.module.scss';

const TIERS = [
  {
    id: 'supporter',
    name: 'Supporter',
    price: 'TZS 25,000',
    period: '/year',
    icon: <Star size={24} />,
    color: '#5A5A5A',
    perks: [
      'Official digital membership card',
      'Monthly club newsletter',
      'Priority ticket purchasing window',
      'Members-only digital content',
    ],
  },
  {
    id: 'member',
    name: 'Club Member',
    price: 'TZS 65,000',
    period: '/year',
    icon: <Shield size={24} />,
    color: '#1B4D2E',
    featured: true,
    perks: [
      'Everything in Supporter',
      'Two complimentary match tickets',
      'Exclusive member jersey discount (20%)',
      'Access to members lounge on matchdays',
      'Quarterly Q&A with coaching staff',
    ],
  },
  {
    id: 'vip',
    name: 'VIP Member',
    price: 'TZS 150,000',
    period: '/year',
    icon: <Zap size={24} />,
    color: '#C9A84C',
    perks: [
      'Everything in Club Member',
      'Four premium match tickets per season',
      'Pre-match stadium tours',
      'Signed player memorabilia',
      'Invitation to end-of-season gala',
      'Dedicated member concierge',
    ],
  },
];

interface FormData {
  name: string;
  email: string;
  phone_number: string;
  membership_type: string;
  message: string;
}

const Join: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState('member');
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone_number: '', membership_type: 'member', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
    setForm((prev) => ({ ...prev, membership_type: tierId }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone_number) return;
    setStatus('loading');
    try {
      await api.post.joinApplication(form);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main>
      <PageHeader
        eyebrow="Membership"
        title="Join the Club"
        subtitle="Become part of the Kilimanjaro FC family. Choose the membership that's right for you."
        image="https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1400"
      />

      {/* Membership tiers */}
      <section className={styles.tiersSection}>
        <div className={styles.container}>
          <div className={styles.tiersGrid}>
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.id}
                className={`${styles.tierCard} ${tier.featured ? styles.featured : ''} ${selectedTier === tier.id ? styles.selected : ''}`}
                style={{ '--tier-color': tier.color } as React.CSSProperties}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                onClick={() => handleTierSelect(tier.id)}
              >
                {tier.featured && <span className={styles.popularBadge}>Most Popular</span>}
                <div className={styles.tierIcon}>{tier.icon}</div>
                <h3 className={styles.tierName}>{tier.name}</h3>
                <div className={styles.price}>
                  <span className={styles.priceAmount}>{tier.price}</span>
                  <span className={styles.pricePeriod}>{tier.period}</span>
                </div>
                <ul className={styles.perksList}>
                  {tier.perks.map((perk) => (
                    <li key={perk} className={styles.perk}>
                      <CheckCircle size={15} className={styles.perkIcon} />
                      {perk}
                    </li>
                  ))}
                </ul>
                <button
                  className={`${styles.selectBtn} ${selectedTier === tier.id ? styles.selectedBtn : ''}`}
                  onClick={() => handleTierSelect(tier.id)}
                >
                  {selectedTier === tier.id ? '✓ Selected' : 'Select Plan'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className={styles.formSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.formCard}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.formTitle}>Complete Your Application</h2>
            <p className={styles.formSubtitle}>
              Fill in your details below and we'll be in touch to complete your membership.
            </p>

            {status === 'success' ? (
              <div className={styles.successMsg}>
                <CheckCircle size={40} className={styles.successIcon} />
                <h3>Application Received!</h3>
                <p>Thank you for joining Kilimanjaro FC. We'll contact you shortly to complete your membership.</p>
              </div>
            ) : (
              <div className={styles.form}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Full Name *</label>
                    <input
                      className={styles.input}
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Email Address *</label>
                    <input
                      className={styles.input}
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Phone Number *</label>
                    <input
                      className={styles.input}
                      name="phone_number"
                      type="tel"
                      placeholder="+255 ..."
                      value={form.phone_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Membership Type</label>
                    <select
                      className={styles.select}
                      name="membership_type"
                      value={form.membership_type}
                      onChange={handleChange}
                    >
                      {TIERS.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Additional Message (optional)</label>
                  <textarea
                    className={styles.textarea}
                    name="message"
                    placeholder="Any questions or special requests..."
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                {status === 'error' && (
                  <p className={styles.errorMsg}>Something went wrong. Please try again.</p>
                )}

                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Submitting…' : 'Submit Application'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Join;
