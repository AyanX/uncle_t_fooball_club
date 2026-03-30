// components/layout/AdminLayout.tsx
import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Newspaper, Users, Calendar, Image,
  Target, Handshake, Settings, LogOut, Menu, X,
  ChevronRight, Trophy, Globe,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import styles from './AdminLayout.module.scss';

const navItems = [
  { path: '/',           icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { path: '/news',       icon: <Newspaper size={18} />,       label: 'News' },
  { path: '/team',       icon: <Users size={18} />,           label: 'Team' },
  { path: '/fixtures',   icon: <Calendar size={18} />,        label: 'Fixtures' },
  { path: '/gallery',    icon: <Image size={18} />,           label: 'Gallery' },
  { path: '/programs',   icon: <Target size={18} />,          label: 'Programmes' },
  { path: '/partners',   icon: <Handshake size={18} />,       label: 'Partners' },
  { path: '/settings',   icon: <Settings size={18} />,        label: 'Settings' },
];

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoMark}><span>K</span></div>
        <div className={styles.logoText}>
          <span className={styles.logoName}>Kilimanjaro</span>
          <span className={styles.logoBadge}>Admin</span>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <span className={styles.navLabel}>Menu</span>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabelText}>{item.label}</span>
            <ChevronRight size={14} className={styles.navChevron} />
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className={styles.sidebarFooter}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>{user?.email?.[0]?.toUpperCase() ?? 'A'}</div>
          <div className={styles.userDetails}>
            <span className={styles.userEmail}>{user?.email ?? 'admin'}</span>
            <span className={styles.userRole}>Administrator</span>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className={styles.root}>
      {/* Desktop sidebar */}
      <aside className={styles.sidebar}>
        <SidebarContent />
      </aside>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            className={`${styles.sidebar} ${styles.mobileSidebar}`}
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          >
            <button className={styles.mobileClose} onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <button className={styles.hamburger} onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className={styles.topbarRight}>
            <div className={styles.topbarUser}>
              <div className={styles.topbarAvatar}>{user?.email?.[0]?.toUpperCase() ?? 'A'}</div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
