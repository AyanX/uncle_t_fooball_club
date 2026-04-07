
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import styles from './Navbar.module.scss';

interface NavItem { label: string; path: string; children?: { label: string; path: string }[]; }

const navItems: NavItem[] = [
  { label: 'Home',      path: '/' },
  { label: 'About',     path: '/about' },
  { label: 'Team',      path: '/team' },
  { label: 'Fixtures',  path: '/fixtures' },
  { label: 'News',      path: '/news' },
  {
    label: 'Programmes', path: '/programs',
    children: [
      { label: 'Sports Academy', path: '/programs/sports' },
      { label: 'Environment',    path: '/programs/environment' },
      { label: 'Health',         path: '/programs/health' },
      { label: 'Arts & Culture', path: '/programs/arts' },
      { label: 'Leadership',     path: '/programs/leadership' },
      { label: 'Libraries',      path: '/programs/libraries' },
    ],
  },
  { label: 'Gallery',  path: '/gallery' },
  { label: 'Partners', path: '/partners' },
  { label: 'Contact',  path: '/contact' },
];

const Navbar: React.FC = () => {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown,   setDropdown]   = useState<string | null>(null);
  const [openSub,    setOpenSub]    = useState<string | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => { setMobileOpen(false); setOpenSub(null); };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo} onClick={closeMobile}>
            <div className={styles.logoMark}><span className={styles.logoK}>U</span></div>
            <div className={styles.logoText}>
              <span className={styles.logoName}>Uncle T</span>
              <span className={styles.logoSub}>Football Club</span>
            </div>
          </Link>

          <ul className={styles.desktopNav}>
            {navItems.map((item) => (
              <li key={item.path} className={styles.navItem}
                onMouseEnter={() => item.children && setDropdown(item.label)}
                onMouseLeave={() => setDropdown(null)}
              >
                {item.children ? (
                  <>
                    <NavLink to={item.path}
                      className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                    >
                      {item.label} <ChevronDown size={13} className={styles.chevron} />
                    </NavLink>
                    <AnimatePresence>
                      {dropdown === item.label && (
                        <motion.ul className={styles.dropdown}
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.16 }}>
                          {item.children.map((c) => (
                            <li key={c.path}>
                              <NavLink to={c.path}
                                className={({ isActive }) => `${styles.dropdownLink} ${isActive ? styles.active : ''}`}
                                onClick={() => setDropdown(null)}
                              >{c.label}</NavLink>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <NavLink to={item.path} end={item.path === '/'}
                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                  >{item.label}</NavLink>
                )}
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <Link to="/contact" className={styles.ctaBtn}>Join the Movement</Link>
            <button className={styles.hamburger} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen
                  ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X size={22} /></motion.span>
                  : <motion.span key="open"  initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Menu size={22} /></motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          >
            <div className={styles.mobileHeader}>
              <Link to="/" className={styles.mobileLogo} onClick={closeMobile}>
                <div className={styles.mobileLogoMark}><span>U</span></div>
                <span className={styles.mobileLogoName}>Uncle T-FC</span>
              </Link>
              <button className={styles.closeBtn} onClick={closeMobile} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            <nav className={styles.mobileNav}>
              {navItems.map((item) => (
                <div key={item.path} className={styles.mobileNavItem}>
                  {item.children ? (
                    <>
                      <button
                        className={`${styles.mobileLink} ${styles.mobileLinkBtn}`}
                        onClick={() => setOpenSub(openSub === item.label ? null : item.label)}
                      >
                        {item.label}
                        <motion.span animate={{ rotate: openSub === item.label ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown size={16} />
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {openSub === item.label && (
                          <motion.div
                            className={styles.mobileSub}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            {item.children.map((c) => (
                              <NavLink key={c.path} to={c.path}
                                className={({ isActive }) => `${styles.mobileSubLink} ${isActive ? styles.active : ''}`}
                                onClick={closeMobile}
                              >{c.label}</NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <NavLink to={item.path} end={item.path === '/'}
                      className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.active : ''}`}
                      onClick={closeMobile}
                    >{item.label}</NavLink>
                  )}
                </div>
              ))}
            </nav>

            <div className={styles.mobileFooter}>
              <Link to="/volunteer" className={styles.mobileCta} onClick={closeMobile}>
                Join the Movement
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
