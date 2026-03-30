// pages/Login/index.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import styles from './Login.module.scss';

const Login: React.FC = () => {
  const { login } = useAuth();
  const { error: toastError, success } = useToast();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('admin@kilimanjaro-fc.com');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toastError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await login(email, password);
      success('Welcome back!');
      navigate('/', { replace: true });
    } catch {
      toastError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Left panel */}
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <div className={styles.brand}>
            <div className={styles.brandMark}><span>K</span></div>
            <div>
              <span className={styles.brandName}>Kilimanjaro FC</span>
              <span className={styles.brandSub}>Admin Dashboard</span>
            </div>
          </div>
          <h1 className={styles.heroTitle}>Manage Your Club</h1>
          <p className={styles.heroSub}>Full control over news, players, fixtures, gallery, programmes, and more — all in one place.</p>
          <div className={styles.features}>
            {['News & Media Management', 'Player & Squad Control', 'Fixtures & Results', 'Gallery & Partners', 'Community Programmes'].map(f => (
              <div key={f} className={styles.feature}>
                <div className={styles.featureDot} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className={styles.right}>
        <motion.div className={styles.card}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Sign In</h2>
            <p className={styles.cardSub}>Enter your admin credentials to continue</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <div className={styles.inputWrap}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@kilimanjaro-fc.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  className={styles.input}
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <><span className={styles.spinner} /> Signing in…</> : <><LogIn size={16} /> Sign In</>}
            </button>
          </form>

          <p className={styles.hint}>Demo: any email + any password</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
