// Contact/index.tsx — Uses fetched socials from context for contact details
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { api } from '@/services/api';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import { useAppContext } from '@/context/AppContext';
import styles from './Contact.module.scss';

const SUBJECTS = [
  'General Enquiry', 'Match Tickets', 'Membership', 'Partnerships & Sponsorship',
  'Media & Press', 'Community Programmes', 'Youth Academy', 'Player Recruitment', 'Other',
];

interface FormState { name: string; phone_number: string; email: string; location: string; subject: string; message: string; }
const initialForm: FormState = { name: '', phone_number: '', email: '', location: '', subject: '', message: '' };

const Contact: React.FC = () => {
  const { socials } = useAppContext();
  const [form, setForm]     = useState<FormState>(initialForm);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = (): boolean => {
    const errs: Partial<FormState> = {};
    if (!form.name.trim())         errs.name         = 'Name is required';
    if (!form.email.trim())        errs.email        = 'Email is required';
    if (!form.phone_number.trim()) errs.phone_number = 'Phone number is required';
    if (!form.message.trim())      errs.message      = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      await api.post.contact(form);
      setStatus('success');
      setForm(initialForm);
    } catch { setStatus('error'); }
  };

  // Format open hours from context
  const hours = socials.open_hours && socials.close_hours
    ? `${socials.open_hours} – ${socials.close_hours}`
    : 'Mon – Fri, 8:00 – 17:00';
  const days = socials.open_day && socials.close_day
    ? `${socials.open_day} – ${socials.close_day}`
    : 'Mon – Fri';

  const contactDetails = [
    { icon: <MapPin size={22} />, label: 'Our Address', value: socials.address },
    { icon: <Phone size={22} />, label: 'Phone', value: socials.phone_number },
    { icon: <Mail size={22} />, label: 'Email', value: socials.email },
    { icon: <Clock size={22} />, label: 'Office Hours', value: `${days}, ${hours}` },
  ];

  return (
    <main>
      <PageHeader
        eyebrow="Get In Touch"
        title="Contact Us"
        subtitle="Have a question, partnership enquiry, or want to get involved? We'd love to hear from you."
        image="https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=1400"
      />

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.layout}>
            {/* Info panel */}
            <motion.div className={styles.infoPanel} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h3 className={styles.infoTitle}>Get in Touch</h3>
              <div className={styles.infoAccent} />
              <p className={styles.infoText}>Our team is always happy to help. Reach out through any of the channels below.</p>

              <ul className={styles.contactList}>
                {contactDetails.map((d) => (
                  <li key={d.label} className={styles.contactItem}>
                    <div className={styles.contactIcon}>{d.icon}</div>
                    <div>
                      <span className={styles.contactLabel}>{d.label}</span>
                      <p className={styles.contactValue}>{d.value}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className={styles.mapPlaceholder}>
                <MapPin size={40} className={styles.mapIcon} />
              </div>
            </motion.div>

            {/* Form panel */}
            <motion.div className={styles.formPanel} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <h3 className={styles.formTitle}>Send a Message</h3>

              {status === 'success' ? (
                <div className={styles.successState}>
                  <CheckCircle size={52} className={styles.successIcon} />
                  <h4 className={styles.successTitle}>Message Sent!</h4>
                  <p className={styles.successText}>Thank you for reaching out. We'll get back to you within 2 business days.</p>
                </div>
              ) : (
                <div className={styles.form}>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label}>Full Name *</label>
                      <input className={styles.input} name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
                      {errors.name && <span className={styles.inputError}>{errors.name}</span>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Email Address *</label>
                      <input className={styles.input} type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                      {errors.email && <span className={styles.inputError}>{errors.email}</span>}
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label}>Phone Number *</label>
                      <input className={styles.input} name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="+255 700 000 000" />
                      {errors.phone_number && <span className={styles.inputError}>{errors.phone_number}</span>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Your Location</label>
                      <input className={styles.input} name="location" value={form.location} onChange={handleChange} placeholder="City, Country" />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Subject</label>
                    <select className={styles.select} name="subject" value={form.subject} onChange={handleChange}>
                      <option value="">Select a subject…</option>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Message *</label>
                    <textarea className={styles.textarea} name="message" value={form.message} onChange={handleChange} placeholder="How can we help you?" rows={5} />
                    {errors.message && <span className={styles.inputError}>{errors.message}</span>}
                  </div>
                  {status === 'error' && <p className={styles.globalError}>Something went wrong. Please try again.</p>}
                  <button className={styles.submitBtn} onClick={handleSubmit} disabled={status === 'loading'}>
                    <Send size={16} /> {status === 'loading' ? 'Sending…' : 'Send Message'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
