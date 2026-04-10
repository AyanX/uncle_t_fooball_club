// components/ui/index.tsx — Shared UI primitives (updated)
import React, { ReactNode, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Upload, Trash2, Pencil } from 'lucide-react';

interface ModalProps { open: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm'|'md'|'lg'; }
export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, size = 'md' }) => {
  const maxW = size === 'sm' ? 440 : size === 'lg' ? 860 : 620;
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
          style={{ position:'fixed',inset:0,background:'rgba(5,10,23,0.72)',backdropFilter:'blur(4px)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16,overflowY:'auto' }}>
          <motion.div initial={{opacity:0,scale:0.94,y:16}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.94,y:16}} transition={{duration:0.22}} onClick={e=>e.stopPropagation()}
            style={{ background:'#fff',borderRadius:16,width:'100%',maxWidth:maxW,boxShadow:'0 24px 64px rgba(0,0,0,0.35)',borderTop:'4px solid #C8102E',margin:'auto' }}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 24px',borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
              <h3 style={{fontFamily:'Montserrat,sans-serif',fontSize:15,fontWeight:800,textTransform:'uppercase',color:'#0A142F',letterSpacing:'-0.01em'}}>{title}</h3>
              <button onClick={onClose} style={{width:32,height:32,borderRadius:8,background:'rgba(0,0,0,0.06)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',border:'none',color:'#718096',flexShrink:0}}>
                <X size={15}/>
              </button>
            </div>
            <div style={{padding:'24px',maxHeight:'80vh',overflowY:'auto'}}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface ConfirmProps { open:boolean; onClose:()=>void; onConfirm:()=>void; title?:string; message?:string; confirmLabel?:string; loading?:boolean; }
export const ConfirmDialog: React.FC<ConfirmProps> = ({ open,onClose,onConfirm,title='Are you sure?',message='This action cannot be undone.',confirmLabel='Delete',loading=false }) => (
  <AnimatePresence>
    {open && (
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
        style={{position:'fixed',inset:0,background:'rgba(5,10,23,0.72)',backdropFilter:'blur(4px)',zIndex:1001,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
        <motion.div initial={{opacity:0,scale:0.92}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.92}} transition={{duration:0.2}} onClick={e=>e.stopPropagation()}
          style={{background:'#fff',borderRadius:16,width:'100%',maxWidth:420,padding:28,boxShadow:'0 24px 64px rgba(0,0,0,0.35)'}}>
          <div style={{display:'flex',gap:16,alignItems:'flex-start',marginBottom:24}}>
            <div style={{width:44,height:44,borderRadius:12,background:'rgba(200,16,46,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <AlertTriangle size={22} color="#C8102E"/>
            </div>
            <div>
              <h4 style={{fontFamily:'Montserrat,sans-serif',fontSize:15,fontWeight:800,textTransform:'uppercase',color:'#0A142F',marginBottom:6}}>{title}</h4>
              <p style={{fontFamily:'Inter,sans-serif',fontSize:14,color:'#4A5568',lineHeight:1.6}}>{message}</p>
            </div>
          </div>
          <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
            <button onClick={onClose} style={{padding:'10px 20px',borderRadius:8,background:'rgba(0,0,0,0.06)',border:'none',fontFamily:'Montserrat,sans-serif',fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',cursor:'pointer',color:'#4A5568'}}>Cancel</button>
            <button onClick={onConfirm} disabled={loading} style={{padding:'10px 20px',borderRadius:8,background:'#C8102E',border:'none',fontFamily:'Montserrat,sans-serif',fontSize:12,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',cursor:loading?'not-allowed':'pointer',color:'#fff',opacity:loading?0.7:1}}>
              {loading ? 'Processing…' : confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const Field: React.FC<{label:string;required?:boolean;error?:string;children:ReactNode;hint?:string}> = ({label,required,error,children,hint}) => (
  <div style={{display:'flex',flexDirection:'column',gap:6}}>
    <label style={{fontFamily:'Montserrat,sans-serif',fontSize:11,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#0A142F'}}>
      {label}{required&&<span style={{color:'#C8102E',marginLeft:2}}>*</span>}
    </label>
    {children}
    {hint && <span style={{fontFamily:'Inter,sans-serif',fontSize:12,color:'#718096'}}>{hint}</span>}
    {error && <span style={{fontFamily:'Inter,sans-serif',fontSize:12,color:'#C8102E'}}>{error}</span>}
  </div>
);

const inputBase: React.CSSProperties = {
  width:'100%',padding:'11px 14px',background:'#F8F9FA',border:'2px solid rgba(10,20,47,0.1)',
  borderRadius:8,fontFamily:'Inter,sans-serif',fontSize:14,color:'#0A142F',outline:'none',transition:'border-color 0.2s,box-shadow 0.2s',
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({style,...props}) => (
  <input {...props} style={{...inputBase,...style}}
    onFocus={e=>{e.target.style.borderColor='#C8102E';e.target.style.boxShadow='0 0 0 3px rgba(200,16,46,0.1)';}}
    onBlur={e=>{e.target.style.borderColor='rgba(10,20,47,0.1)';e.target.style.boxShadow='none';}}
  />
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({style,...props}) => (
  <textarea {...props} style={{...inputBase,resize:'vertical',minHeight:90,...style as any}
  } onFocus={e=>{e.target.style.borderColor='#C8102E';e.target.style.boxShadow='0 0 0 3px rgba(200,16,46,0.1)';}}
    onBlur={e=>{e.target.style.borderColor='rgba(10,20,47,0.1)';e.target.style.boxShadow='none';}}
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({style,...props}) => (
  <select {...props} style={{...inputBase,appearance:'none',cursor:'pointer',...style as any}}
    onFocus={e=>{e.target.style.borderColor='#C8102E';}}
    onBlur={e=>{e.target.style.borderColor='rgba(10,20,47,0.1)';}}
  />
);

type BtnVariant = 'primary'|'secondary'|'danger'|'ghost'|'warning';
const btnStyles: Record<BtnVariant, React.CSSProperties> = {
  primary:   {background:'#C8102E',color:'#fff',border:'2px solid #C8102E'},
  secondary: {background:'transparent',color:'#0A142F',border:'2px solid rgba(10,20,47,0.2)'},
  danger:    {background:'rgba(200,16,46,0.08)',color:'#C8102E',border:'2px solid rgba(200,16,46,0.25)'},
  ghost:     {background:'rgba(0,0,0,0.05)',color:'#4A5568',border:'2px solid transparent'},
  warning:   {background:'rgba(217,119,6,0.1)',color:'#d97706',border:'2px solid rgba(217,119,6,0.3)'},
};

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: BtnVariant; loading?: boolean; size?: 'sm'|'md'; }
export const Btn: React.FC<BtnProps> = ({variant='primary',loading,children,style,size='md',...rest}) => (
  <button {...rest} style={{
    display:'inline-flex',alignItems:'center',gap:7,
    padding: size==='sm'?'7px 14px':'10px 18px',
    borderRadius:8,fontFamily:'Montserrat,sans-serif',
    fontSize: size==='sm'?11:12,fontWeight:700,textTransform:'uppercase',
    letterSpacing:'0.07em',cursor:(rest.disabled||loading)?'not-allowed':'pointer',
    opacity:(rest.disabled||loading)?0.65:1,transition:'all 0.18s',whiteSpace:'nowrap',
    ...btnStyles[variant],...style,
  }}>
    {loading ? 'Loading…' : children}
  </button>
);

export const Badge: React.FC<{text:string;color?:string}> = ({text,color='#C8102E'}) => (
  <span style={{display:'inline-block',padding:'2px 10px',borderRadius:999,fontFamily:'Montserrat,sans-serif',fontSize:11,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',background:color+'18',color}}>
    {text}
  </span>
);

export const Toggle: React.FC<{checked:boolean;onChange:(v:boolean)=>void;label?:string}> = ({checked,onChange,label}) => (
  <label style={{display:'inline-flex',alignItems:'center',gap:10,cursor:'pointer',userSelect:'none'}}>
    <div onClick={()=>onChange(!checked)} style={{width:42,height:24,borderRadius:12,background:checked?'#C8102E':'#d1d5db',position:'relative',transition:'background 0.2s',flexShrink:0}}>
      <div style={{position:'absolute',top:3,left:checked?19:3,width:18,height:18,borderRadius:'50%',background:'#fff',boxShadow:'0 1px 4px rgba(0,0,0,0.2)',transition:'left 0.2s'}}/>
    </div>
    {label&&<span style={{fontFamily:'Inter,sans-serif',fontSize:14,color:'#4A5568'}}>{label}</span>}
  </label>
);

interface ImageInputProps {
  currentUrl?: string;
  onFileSelect: (file: File | null) => void;
  label?: string;
  onRemoveCurrent?: () => void;
}

export const ImageInput: React.FC<ImageInputProps> = ({ currentUrl, onFileSelect, label = 'Image', onRemoveCurrent }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [showFileInput, setShowFileInput] = React.useState(!currentUrl);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    onFileSelect(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = ev => setPreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const removeImage = () => {
    onFileSelect(null);
    setPreview(null);
    setShowFileInput(true);
    onRemoveCurrent?.();
    if (fileRef.current) fileRef.current.value = '';
  };

  const displayUrl = preview || currentUrl;

  return (
    <Field label={label}>
      {displayUrl && !showFileInput ? (
        <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '2px solid rgba(10,20,47,0.1)' }}>
          <img src={displayUrl} alt={label} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6 }}>
            <button type="button" onClick={() => { setShowFileInput(true); setPreview(null); onFileSelect(null); }}
              style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
              <Pencil size={14} color="#0A142F"/>
            </button>
            <button type="button" onClick={removeImage}
              style={{ width: 32, height: 32, borderRadius: 8, background: '#C8102E', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(200,16,46,0.3)' }}>
              <Trash2 size={14} color="#fff"/>
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          style={{ border: '2px dashed rgba(200,16,46,0.35)', borderRadius: 10, padding: '28px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', background: 'rgba(200,16,46,0.02)', transition: 'all 0.2s' }}
          onMouseEnter={e=>(e.currentTarget.style.background='rgba(200,16,46,0.06)')}
          onMouseLeave={e=>(e.currentTarget.style.background='rgba(200,16,46,0.02)')}
        >
          <Upload size={22} color="#C8102E"/>
          <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C8102E' }}>
            {preview ? 'Change Image' : 'Upload Image'}
          </span>
          <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#718096' }}>JPG, PNG, WebP — max 5MB</span>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
    </Field>
  );
};

export const PageHeader: React.FC<{ title: string; sub?: string; actions?: ReactNode }> = ({ title, sub, actions }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
    <div>
      <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 900, textTransform: 'uppercase', color: '#0A142F', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{title}</h1>
      {sub && <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#718096', marginTop: 4 }}>{sub}</p>}
    </div>
    {actions && <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>{actions}</div>}
  </div>
);

export const Table: React.FC<{ headers: string[]; children: ReactNode; }> = ({ headers, children }) => (
  <div style={{ width: '100%', overflowX: 'auto', borderRadius: 12, border: '1px solid rgba(10,20,47,0.07)', background: '#fff' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
      <thead>
        <tr style={{ background: '#F8F9FA', borderBottom: '1px solid rgba(10,20,47,0.08)' }}>
          {headers.map(h => (
            <th key={h} style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#718096', padding: '12px 16px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export const TR: React.FC<{ children: ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <tr onClick={onClick} style={{ borderBottom: '1px solid rgba(10,20,47,0.05)', cursor: onClick ? 'pointer' : 'default', transition: 'background 0.15s' }}
    onMouseEnter={e => { if (onClick) (e.currentTarget as HTMLElement).style.background = '#fafafa'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
    {children}
  </tr>
);

export const TD: React.FC<{ children: ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <td style={{ padding: '12px 16px', fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#0A142F', verticalAlign: 'middle', ...style }}>{children}</td>
);

export const ActionBtns: React.FC<{ onEdit?: () => void; onDelete?: () => void; extra?: ReactNode }> = ({ onEdit, onDelete, extra }) => (
  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
    {extra}
    {onEdit && (
      <button onClick={onEdit} title="Edit" style={{ width: 30, height: 30, borderRadius: 7, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,20,47,0.07)', color: '#0A142F', transition: 'all 0.15s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0A142F'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(10,20,47,0.07)'; (e.currentTarget as HTMLElement).style.color = '#0A142F'; }}>
        <Pencil size={13}/>
      </button>
    )}
    {onDelete && (
      <button onClick={onDelete} title="Delete" style={{ width: 30, height: 30, borderRadius: 7, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200,16,46,0.08)', color: '#C8102E', transition: 'all 0.15s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C8102E'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(200,16,46,0.08)'; (e.currentTarget as HTMLElement).style.color = '#C8102E'; }}>
        <Trash2 size={13}/>
      </button>
    )}
  </div>
);

export const Skeleton: React.FC<{ h?: number; r?: number }> = ({ h = 60, r = 8 }) => (
  <div style={{ height: h, borderRadius: r, background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }}>
    <style>{`@keyframes shimmer{to{background-position:-200% 0}}`}</style>
  </div>
);

export const SectionCard: React.FC<{ title?: string; actions?: ReactNode; children: ReactNode; style?: React.CSSProperties }> = ({ title, actions, children, style }) => (
  <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid rgba(10,20,47,0.07)', ...style }}>
    {(title || actions) && (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(10,20,47,0.07)', flexWrap: 'wrap', gap: 10 }}>
        {title && <h3 style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', color: '#0A142F', letterSpacing: '0.04em' }}>{title}</h3>}
        {actions}
      </div>
    )}
    {children}
  </div>
);

export const FormGrid: React.FC<{ children: ReactNode; cols?: 1|2|3 }> = ({ children, cols = 2 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16, alignItems: 'start' }}>
    {children}
  </div>
);

export const FullRow: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div style={{ gridColumn: '1 / -1' }}>{children}</div>
);
