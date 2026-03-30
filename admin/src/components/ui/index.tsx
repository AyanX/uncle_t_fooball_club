// components/ui/index.tsx — Shared UI primitives
import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

// ── Modal ─────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, size = 'md' }) => {
  const maxW = size === 'sm' ? 420 : size === 'lg' ? 800 : 600;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(5,10,23,0.72)',
            backdropFilter: 'blur(4px)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, overflowY: 'auto',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 16, width: '100%', maxWidth: maxW,
              boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
              borderTop: '4px solid #C8102E', margin: 'auto',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 16, fontWeight: 800, textTransform: 'uppercase', color: '#0A142F', letterSpacing: '-0.01em' }}>{title}</h3>
              <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', color: '#718096' }}>
                <X size={16} />
              </button>
            </div>
            {/* Body */}
            <div style={{ padding: '24px', maxHeight: '80vh', overflowY: 'auto' }}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Confirm Dialog ────────────────────────────────────────
interface ConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmProps> = ({
  open, onClose, onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  loading = false,
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(5,10,23,0.72)', backdropFilter: 'blur(4px)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
          onClick={e => e.stopPropagation()}
          style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 420, padding: 28, boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}
        >
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(200,16,46,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={22} color="#C8102E" />
            </div>
            <div>
              <h4 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 15, fontWeight: 800, textTransform: 'uppercase', color: '#0A142F', marginBottom: 6 }}>{title}</h4>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#4A5568', lineHeight: 1.6 }}>{message}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 8, background: 'rgba(0,0,0,0.06)', border: 'none', fontFamily: 'Montserrat,sans-serif', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', color: '#4A5568' }}>
              Cancel
            </button>
            <button onClick={onConfirm} disabled={loading} style={{ padding: '10px 20px', borderRadius: 8, background: '#C8102E', border: 'none', fontFamily: 'Montserrat,sans-serif', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', cursor: loading ? 'not-allowed' : 'pointer', color: '#fff', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Deleting…' : confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ── Form field ────────────────────────────────────────────
interface FieldProps {
  label: string; required?: boolean; error?: string;
  children: ReactNode;
}
export const Field: React.FC<FieldProps> = ({ label, required, error, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0A142F' }}>
      {label} {required && <span style={{ color: '#C8102E' }}>*</span>}
    </label>
    {children}
    {error && <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#C8102E' }}>{error}</span>}
  </div>
);

const inputBase: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  background: '#F8F9FA', border: '2px solid rgba(10,20,47,0.1)',
  borderRadius: 8, fontFamily: 'Inter,sans-serif', fontSize: 14,
  color: '#0A142F', outline: 'none', transition: 'border-color 0.2s',
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} style={{ ...inputBase, ...props.style }}
    onFocus={e => { e.target.style.borderColor = '#C8102E'; e.target.style.boxShadow = '0 0 0 3px rgba(200,16,46,0.1)'; }}
    onBlur={e => { e.target.style.borderColor = 'rgba(10,20,47,0.1)'; e.target.style.boxShadow = 'none'; }}
  />
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea {...props} style={{ ...inputBase, resize: 'vertical', minHeight: 90, ...props.style as any }}
    onFocus={e => { e.target.style.borderColor = '#C8102E'; e.target.style.boxShadow = '0 0 0 3px rgba(200,16,46,0.1)'; }}
    onBlur={e => { e.target.style.borderColor = 'rgba(10,20,47,0.1)'; e.target.style.boxShadow = 'none'; }}
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select {...props} style={{ ...inputBase, appearance: 'none', cursor: 'pointer', ...props.style as any }}
    onFocus={e => { e.target.style.borderColor = '#C8102E'; }}
    onBlur={e => { e.target.style.borderColor = 'rgba(10,20,47,0.1)'; }}
  />
);

// ── Btn ───────────────────────────────────────────────────
type BtnVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: BtnVariant; loading?: boolean; }

const btnStyles: Record<BtnVariant, React.CSSProperties> = {
  primary:   { background: '#C8102E', color: '#fff', border: '2px solid #C8102E' },
  secondary: { background: 'transparent', color: '#0A142F', border: '2px solid rgba(10,20,47,0.2)' },
  danger:    { background: 'rgba(200,16,46,0.08)', color: '#C8102E', border: '2px solid rgba(200,16,46,0.25)' },
  ghost:     { background: 'rgba(0,0,0,0.05)', color: '#4A5568', border: '2px solid transparent' },
};

export const Btn: React.FC<BtnProps> = ({ variant = 'primary', loading, children, style, ...rest }) => (
  <button {...rest} style={{
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px',
    borderRadius: 8, fontFamily: 'Montserrat,sans-serif', fontSize: 12,
    fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
    cursor: rest.disabled || loading ? 'not-allowed' : 'pointer',
    opacity: rest.disabled || loading ? 0.65 : 1,
    transition: 'all 0.2s', whiteSpace: 'nowrap',
    ...btnStyles[variant], ...style,
  }}>
    {loading ? 'Loading…' : children}
  </button>
);

// ── Badge ─────────────────────────────────────────────────
export const Badge: React.FC<{ text: string; color?: string }> = ({ text, color = '#C8102E' }) => (
  <span style={{
    display: 'inline-block', padding: '2px 10px', borderRadius: 999,
    fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 700,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    background: color + '18', color,
  }}>{text}</span>
);

// ── Toggle switch ─────────────────────────────────────────
export const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label?: string }> = ({ checked, onChange, label }) => (
  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 42, height: 24, borderRadius: 12,
        background: checked ? '#C8102E' : '#d1d5db',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: checked ? 19 : 3,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s',
      }} />
    </div>
    {label && <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#4A5568' }}>{label}</span>}
  </label>
);
