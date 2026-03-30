// Footer.tsx — Uses fetched socials from context for contact info and social links
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Twitter, Instagram, Facebook, Youtube } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  const { socials } = useAppContext();
  const year = new Date().getFullYear();

  const socialLinks = [
    { icon: <Twitter size={18} />, href: socials.twitter, label: 'Twitter' },
    { icon: <Instagram size={18} />, href: socials.instagram, label: 'Instagram' },
    { icon: <Facebook size={18} />, href: socials.facebook, label: 'Facebook' },
    { icon: <Youtube size={18} />, href: socials.youtube, label: 'YouTube' },
  ].filter((s) => !!s.href);

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.container}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <div className={styles.logoMark}><span>K</span></div>
              <div className={styles.logoText}>
                <span className={styles.logoName}>Kilimanjaro</span>
                <span className={styles.logoSub}>Football Club</span>
              </div>
            </Link>
            <p className={styles.tagline}>Born from the slopes of Africa's greatest mountain. Playing for the continent's future.</p>
            {socialLinks.length > 0 && (
              <div className={styles.socials}>
                {socialLinks.map(({ icon, href, label }) => (
                  <a key={label} href={href!} target="_blank" rel="noopener noreferrer" aria-label={label} className={styles.socialLink}>{icon}</a>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Club</h4>
            <ul className={styles.linkList}>
              {[['About Us','/about'],['First Team','/team'],['Fixtures','/fixtures'],['Latest News','/news'],['Gallery','/gallery']].map(([label,path]) => (
                <li key={path}><Link to={path} className={styles.footerLink}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Programmes</h4>
            <ul className={styles.linkList}>
              {[['Sports Academy','/programs/sports'],['Green Goals','/programs/environment'],['Healthy Nation','/programs/health'],['Creative Kicks','/programs/arts'],['Future Leaders','/programs/leadership'],['Reading FC','/programs/libraries']].map(([label,path]) => (
                <li key={path}><Link to={path} className={styles.footerLink}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact from fetched socials */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Contact</h4>
            <ul className={styles.contactList}>
              {socials.address && (
                <li><MapPin size={15} className={styles.contactIcon} /><span>{socials.address}</span></li>
              )}
              {socials.phone_number && (
                <li><Phone size={15} className={styles.contactIcon} /><a href={`tel:${socials.phone_number}`} className={styles.footerLink}>{socials.phone_number}</a></li>
              )}
              {socials.email && (
                <li><Mail size={15} className={styles.contactIcon} /><a href={`mailto:${socials.email}`} className={styles.footerLink}>{socials.email}</a></li>
              )}
            </ul>
            <Link to="/volunteer" className={styles.joinBtn}>Volunteer</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <p className={styles.copy}>&copy; {year} Kilimanjaro FC. All rights reserved.</p>
          <div className={styles.legal}>
            <Link to="/contact" className={styles.legalLink}>Privacy Policy</Link>
            <Link to="/contact" className={styles.legalLink}>Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
