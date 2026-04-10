import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Heart, Users, Globe, Zap } from 'lucide-react';
import { api } from '@/services/api';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import SectionTitle from '@/components/common/SectionTitle/SectionTitle';
import styles from './Volunteer.module.scss';

const AREAS = [
  { id: 'coaching', label: 'Coaching & Training', icon: <Zap size={24} />, desc: 'Assist coaches in youth academies and training sessions.' },
  { id: 'community', label: 'Community Programmes', icon: <Heart size={24} />, desc: 'Support our outreach initiatives across schools and neighbourhoods.' },
  { id: 'events', label: 'Events & Matchdays', icon: <Users size={24} />, desc: 'Help organise matchday logistics and fan experiences.' },
  { id: 'media', label: 'Media & Communications', icon: <Globe size={24} />, desc: 'Create content, photography, or social media for the club.' },
];

interface FormState {
  name: string; email: string; phone_number: string; area: string; message: string;
}
const initial: FormState = { name: '', email: '', phone_number: '', area: '', message: '' };

const Volunteer: React.FC = () => {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [selectedArea, setSelectedArea] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus('loading');
    try {
      await api.post.volunteerApplication({ ...form, area: selectedArea || form.area });
      setStatus('success');
      setForm(initial);
      setSelectedArea('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main>
      <PageHeader
        eyebrow="Get Involved"
        title="Volunteer With Us"
        subtitle="Join hundreds of passionate volunteers helping Uncle T FC make a real difference in communities across East Africa."
        image="https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1400"
      />

      {/* Why volunteer */}
      <section className={styles.whySection}>
        <div className={styles.container}>
          <SectionTitle eyebrow="Make an Impact" title="Why Volunteer?" subtitle="Your time and skills can transform lives. Here's what volunteering with Uncle T FC looks like." align="center" />
          <div className={styles.areasGrid}>
            {AREAS.map((area, i) => (
              <motion.div
                key={area.id}
                className={`${styles.areaCard} ${selectedArea === area.id ? styles.areaSelected : ''}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                onClick={() => setSelectedArea(area.id)}
              >
                <div className={styles.areaIcon}>{area.icon}</div>
                <h4 className={styles.areaLabel}>{area.label}</h4>
                <p className={styles.areaDesc}>{area.desc}</p>
                {selectedArea === area.id && <CheckCircle size={18} className={styles.areaCheck} />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className={styles.formSection}>
        <div className={styles.container}>
          <div className={styles.formCard}>
            <SectionTitle eyebrow="Apply Now" title="Volunteer Application" subtitle="Fill in the form below and our community team will be in touch within 3 business days." />

            {status === 'success' ? (
              <motion.div className={styles.successMsg} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <CheckCircle size={56} className={styles.successIcon} />
                <h3 className={styles.successTitle}>Application Received!</h3>
                <p className={styles.successText}>Thank you for signing up to volunteer with Uncle T FC. Our team will contact you shortly.</p>
              </motion.div>
            ) : (
              <div className={styles.form}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Full Name *</label>
                    <input className={styles.input} name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Email Address *</label>
                    <input className={styles.input} type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Phone Number</label>
                    <input className={styles.input} name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="+255 700 000 000" />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Area of Interest</label>
                    <select className={styles.select} name="area" value={selectedArea || form.area} onChange={(e) => { setSelectedArea(e.target.value); handleChange(e); }}>
                      <option value="">Select an area…</option>
                      {AREAS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Tell Us About Yourself</label>
                  <textarea className={styles.textarea} name="message" value={form.message} onChange={handleChange} placeholder="Share your background, skills, and why you'd like to volunteer…" rows={5} />
                </div>
                {status === 'error' && <p className={styles.errorMsg}>Something went wrong. Please try again.</p>}
                <button className={styles.submitBtn} onClick={handleSubmit} disabled={status === 'loading'}>
                  {status === 'loading' ? 'Submitting…' : 'Submit Application'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Volunteer;
