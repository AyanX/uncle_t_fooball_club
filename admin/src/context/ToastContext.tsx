// context/ToastContext.tsx — Global toast notifications
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';
interface Toast { id: number; type: ToastType; message: string; }

interface ToastContextType {
  toast: (type: ToastType, message: string) => void;
  success: (msg: string) => void;
  error: (msg: string) => void;
  warning: (msg: string) => void;
  info: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType);

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} />,
  error:   <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info:    <Info size={18} />,
};

const colours: Record<ToastType, string> = {
  success: '#16a34a',
  error:   '#C8102E',
  warning: '#d97706',
  info:    '#2563eb',
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let counter = 0;

  const toast = useCallback((type: ToastType, message: string) => {
    const id = ++counter + Date.now();
    setToasts(p => [...p, { id, type, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const dismiss = (id: number) => setToasts(p => p.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{
      toast,
      success: (m) => toast('success', m),
      error:   (m) => toast('error', m),
      warning: (m) => toast('warning', m),
      info:    (m) => toast('info', m),
    }}>
      {children}
      {/* Toast container */}
      <div style={{
        position: 'fixed', bottom: 24, right: 24,
        display: 'flex', flexDirection: 'column', gap: 10,
        zIndex: 9999, maxWidth: 360, width: 'calc(100vw - 48px)',
      }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.22 }}
              style={{
                background: '#fff',
                borderRadius: 10,
                padding: '12px 14px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
                display: 'flex', alignItems: 'flex-start', gap: 10,
                borderLeft: `4px solid ${colours[t.type]}`,
              }}
            >
              <span style={{ color: colours[t.type], marginTop: 1, flexShrink: 0 }}>{icons[t.type]}</span>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#0A142F', flex: 1, lineHeight: 1.5 }}>
                {t.message}
              </p>
              <button onClick={() => dismiss(t.id)} style={{ color: '#9ca3af', cursor: 'pointer', background: 'none', border: 'none', padding: 0, flexShrink: 0 }}>
                <X size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
