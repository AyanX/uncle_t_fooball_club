
import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Newspaper, Users, Calendar, Image,
  Target, Handshake, Settings, LogOut, Menu, X, MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import styles from './AdminLayout.module.scss';

const navItems = [
  { path: '/',          icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
  { path: '/news',      icon: <Newspaper size={17} />,       label: 'News' },
  { path: '/team',      icon: <Users size={17} />,           label: 'Team' },
  { path: '/fixtures',  icon: <Calendar size={17} />,        label: 'Fixtures' },
  { path: '/gallery',   icon: <Image size={17} />,           label: 'Gallery' },
  { path: '/programs',  icon: <Target size={17} />,          label: 'Programmes' },
  { path: '/partners',  icon: <Handshake size={17} />,       label: 'Partners' },
  { path: '/messages',  icon: <MessageSquare size={17} />,   label: 'Messages' },
  { path: '/settings',  icon: <Settings size={17} />,        label: 'Settings' },
];

const pageTitles: Record<string, string> = {
  '/': 'Dashboard', '/news': 'News', '/team': 'Team', '/fixtures': 'Fixtures',
  '/gallery': 'Gallery', '/programs': 'Programmes', '/partners': 'Partners', '/settings': 'Settings',
};

const SidebarInner: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    onClose?.();
    await logout();
    success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  return (
    <>
      {onClose && (
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
          <X size={16} />
        </button>
      )}

      {}
      <div className={styles.sidebarBrand}>
        <div className={styles.logoMark}>K</div>
        <div className={styles.brandText}>
          <span className={styles.brandName}>Kilimanjaro</span>
          <span className={styles.brandBadge}>Admin Panel</span>
        </div>
      </div>

      {}
      <nav className={styles.sidebarNav}>
        <span className={styles.navSection}>Navigation</span>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            onClick={onClose}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {}
      <div className={styles.sidebarFooter}>
        <div className={styles.userCard}>
          <div className={styles.userAvatar}>
            {(user?.username || user?.email || 'A')[0].toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.username || 'Admin'}</span>
            <span className={styles.userEmail}>{user?.email || ''}</span>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </>
  );
};

const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Get page title from location
  const pathKey = Object.keys(pageTitles).find(k =>
    k === '/' ? location.pathname === '/' : location.pathname.startsWith(k)
  ) || '/';
  const pageTitle = pageTitles[pathKey] || 'Admin';

  return (
    <div className={styles.root}>
      {}
      <aside className={styles.sidebar}>
        <SidebarInner />
      </aside>

      {}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className={`${styles.sidebar} ${styles.mobileSidebar}`}
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            <SidebarInner onClose={() => setMobileOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {}
      <div className={styles.main}>
        {}
        <header className={styles.topbar}>
          <button className={styles.hamburger} onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className={styles.topbarCenter}>
            <span className={styles.topbarTitle}>{pageTitle}</span>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.topbarUser}>
              <div className={styles.topbarAvatar}>
                {(user?.username || user?.email || 'A')[0].toUpperCase()}
              </div>
              <span className={styles.topbarName}>{user?.username || 'Admin'}</span>
            </div>
          </div>
        </header>

        {}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
