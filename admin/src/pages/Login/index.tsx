import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, Hash } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/services/api';
import styles from './Login.module.scss';
import blurLogo from "@/assets/uncle-t-soccer-logo-small.png";
type LoginMode = 'password' | 'pin';

const useLogo = () => {
  const [logo, setLogo] = useState<{ image: string; blur_image: string } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get.logo().then(l => { if (l) setLogo(l as any); }).catch(() => {});
  }, []);

  return { logo, loaded, setLoaded };
};

const Login: React.FC = () => {
  const { login, loginWithPin }            = useAuth();
  const { error: toastError, success }     = useToast();
  const navigate                           = useNavigate();
  const { logo, loaded, setLoaded }        = useLogo();

  const [mode, setMode]         = useState<LoginMode>('password');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin]           = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toastError('Please enter your email address'); return; }

    if (mode === 'password') {
      if (!password) { toastError('Please enter your password'); return; }
      setLoading(true);
      try {
        await login(email, password);
        success('Welcome back!');
        navigate('/', { replace: true });
      } catch (err: any) {
        toastError(err?.response?.data?.message || 'Invalid credentials. Please try again.');
      } finally { setLoading(false); }
    } else {
      if (!pin || !/^\d{4,8}$/.test(pin)) { toastError('PIN must be 4–8 digits'); return; }
      setLoading(true);
      try {
        await loginWithPin(email, pin);
        success('Welcome back!');
        navigate('/', { replace: true });
      } catch (err: any) {
        toastError(err?.response?.data?.message || 'Invalid PIN. Please try again.');
      } finally { setLoading(false); }
    }
  };

  return (
    <div className={styles.page}>
      {/* Left panel */}
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <div className={styles.brand}>
            {/* Logo: always show blurLogo as fallback, fade to actual logo when loaded */}
            <div className={styles.brandLogoWrap}>
              {/* Imported blurLogo as initial placeholder */}
              <img
                src={blurLogo}
                aria-hidden={!!logo?.image}
                alt={logo?.image ? "" : "Club logo"}
                className={styles.brandLogoBlur}
                style={{ opacity: loaded ? 0 : 1, transition: 'opacity 0.3s ease' }}
              />
              
              {/* Actual fetched logo (if available) */}
              {logo?.image && (
                <>
                  {logo.blur_image && (
                    <img src={logo.blur_image} aria-hidden alt=""
                      className={styles.brandLogoBlur}
                      style={{ opacity: loaded ? 0 : 1, transition: 'opacity 0.3s ease' }}
                    />
                  )}
                  <img
                    src={logo.image}
                    alt="Club logo"
                    className={styles.brandLogoImg}
                    onLoad={() => setLoaded(true)}
                    style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
                  />
                </>
              )}
            </div>
            <div>
              <span className={styles.brandName}>Uncle T FC</span>
              <span className={styles.brandSub}>Admin Dashboard</span>
            </div>
          </div>
          <h1 className={styles.heroTitle}>Manage Your Club</h1>
          <p className={styles.heroSub}>Full control over news, players, fixtures, gallery, programmes, and more — all in one place.</p>
          <div className={styles.features}>
            {['News & Media Management','Player & Squad Control','Fixtures & Results','Gallery & Partners','Community Programmes']?.map(f => (
              <div key={f} className={styles.feature}>
                <div className={styles.featureDot} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className={styles.right}>
        <motion.div className={styles.card} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* Mode tabs */}
          <div className={styles.modeTabs}>
            <button className={`${styles.modeTab} ${mode === 'password' ? styles.modeActive : ''}`}
              onClick={() => setMode('password')} type="button">
              <Lock size={14} /> Password Login
            </button>
            <button className={`${styles.modeTab} ${mode === 'pin' ? styles.modeActive : ''}`}
              onClick={() => setMode('pin')} type="button">
              <Hash size={14} /> Login with PIN
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={mode}
              initial={{ opacity: 0, x: mode === 'pin' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>{mode === 'password' ? 'Sign In' : 'PIN Login'}</h2>
                <p className={styles.cardSub}>
                  {mode === 'password'
                    ? 'Enter your admin credentials to continue'
                    : 'Enter your email and security PIN to sign in'}
                </p>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label className={styles.label}>Email Address</label>
                  <div className={styles.inputWrap}>
                    <Mail size={16} className={styles.inputIcon} />
                    <input className={styles.input} type="email" value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@uncleTfc.com"
                      autoComplete="email" required />
                  </div>
                </div>

                {mode === 'password' ? (
                  <div className={styles.field}>
                    <label className={styles.label}>Password</label>
                    <div className={styles.inputWrap}>
                      <Lock size={16} className={styles.inputIcon} />
                      <input className={styles.input}
                        type={showPass ? 'text' : 'password'}
                        value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password" required />
                      <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.field}>
                    <label className={styles.label}>Security PIN <span className={styles.pinHint}>(4–8 digits)</span></label>
                    <div className={styles.inputWrap}>
                      <Hash size={16} className={styles.inputIcon} />
                      <input className={`${styles.input} ${styles.pinInput}`}
                        type="password" inputMode="numeric"
                        value={pin} onChange={e => setPin(e.target.value.replace(/\D/, '').slice(0, 8))}
                        placeholder="••••" maxLength={8} required />
                    </div>
                  </div>
                )}

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading
                    ? <><span className={styles.spinner} /> Signing in…</>
                    : <><LogIn size={16} /> {mode === 'password' ? 'Sign In' : 'Sign In with PIN'}</>
                  }
                </button>
              </form>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
