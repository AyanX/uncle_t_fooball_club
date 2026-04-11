import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import styles from './Navbar.module.scss';
import blurLogo from '@/assets/uncle-t-soccer-logo-small.png';


interface NavItem { label: string; path: string; children?: { label: string; path: string }[]; }

const navItems: NavItem[] = [
  { label: 'Home',      path: '/' },
  { label: 'About',     path: '/about' },
  { label: 'Team',      path: '/team' },
  { label: 'Fixtures',  path: '/fixtures' },
  { label: 'News',      path: '/news' },
  {
    label: 'Programmes', path: '/programs',
    children: [],
  },
  { label: 'Gallery',  path: '/gallery' },
  { label: 'Partners', path: '/partners' },
  { label: 'Contact',  path: '/contact' },
];

const LogoMark: React.FC<{ image?: string; blurImage?: string }> = ({ image, blurImage }) => {
  const [loaded, setLoaded] = useState(false);

  if (!blurImage && !image) {
    return <div className={styles.logoMark}><span className={styles.logoK}>K</span></div>;
  }

  return (
    <div className={styles.logoImgWrap}>
      {blurImage && (
        <img src={blurImage} aria-hidden alt=""
          className={styles.logoBlur}
          style={{ opacity: loaded ? 0 : 1 }}
        />
      )}
      <img
        src={image}
        alt="Uncle T FC"
        className={styles.logoImg}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
};

const Navbar: React.FC = () => {
  const { logo, programTitles } = useAppContext();
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown,   setDropdown]   = useState<string | null>(null);
  const [openSub,    setOpenSub]    = useState<string | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Cleanup overflow on unmount
  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  const closeMobile = () => { setMobileOpen(false); setOpenSub(null); };

  // Build programmes children dynamically from fetched programTitles
  const navWithPrograms = navItems.map(item => {
    if (item.path === '/programs' && programTitles?.length > 0) {
      return {
        ...item,
        children: programTitles && programTitles?.map(t => ({
          label: t.title,
          path:  `/programs/${t.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
        })),
      };
    }
    return item;
  });

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} onClick={closeMobile}>
          <LogoMark image={logo?.image} blurImage={blurLogo} />
          <div className={styles.logoText}>
            <span className={styles.logoName}>Uncle T</span>
            <span className={styles.logoSub}>Football Club</span>
          </div>
        </Link>

        <ul className={styles.desktopNav}>
          {navWithPrograms.map((item) => (
            <li key={item.path} className={styles.navItem}
              onMouseEnter={() => item?.children && item.children?.length > 0 && setDropdown(item.label)}
              onMouseLeave={() => setDropdown(null)}>
              <NavLink to={item.path} end={item.path === '/'} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                {item.label}
                {item.children && item.children?.length > 0 && <ChevronDown size={13} className={styles.chevron} />}
              </NavLink>
              <AnimatePresence>
                {item?.children && item.children?.length > 0 && dropdown === item.label && (
                  <motion.ul className={styles.dropdown}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}>
                    {item.children.map(child => (
                      <li key={child.path}>
                        <NavLink to={child.path} className={({ isActive }) => `${styles.dropItem} ${isActive ? styles.active : ''}`} onClick={() => setDropdown(null)}>
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        <button className={styles.hamburger} onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className={styles.mobileMenu}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}>
              <div className={styles.mobileHeader}>
                <Link to="/" className={styles.mobileLogo} onClick={closeMobile}>
                  <LogoMark image={logo?.image} blurImage={logo?.blur_image} />
                  <div className={styles.logoText}>
                    <span className={styles.logoName}>Uncle T</span>
                    <span className={styles.logoSub}>Football Club</span>
                  </div>
                </Link>
                <button className={styles.closeBtn} onClick={closeMobile} aria-label="Close menu"><X size={22} /></button>
              </div>
              <ul className={styles.mobileNav}>
                {navWithPrograms.map(item => (
                  <li key={item.path} className={styles.mobileNavItem}>
                    {item.children && item.children?.length > 0 ? (
                      <>
                        <button className={styles.mobileLinkBtn} onClick={() => setOpenSub(openSub === item.label ? null : item.label)}>
                          {item.label} <ChevronDown size={14} className={`${styles.chevron} ${openSub === item.label ? styles.chevronOpen : ''}`} />
                        </button>
                        <AnimatePresence>
                          {openSub === item.label && (
                            <motion.ul className={styles.mobileSub}
                              initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                              transition={{ duration: 0.22 }}>
                              {item.children.map(child => (
                                <li key={child.path}>
                                  <NavLink to={child.path} className={styles.mobileSubLink} onClick={closeMobile}>{child.label}</NavLink>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <NavLink to={item.path} end={item.path === '/'} className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.active : ''}`} onClick={closeMobile}>
                        {item.label}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
