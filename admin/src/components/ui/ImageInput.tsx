import React, { useState, useRef } from 'react';
import { Upload, Pencil, Trash2 } from 'lucide-react';

interface ImageInputProps {
  currentUrl?: string;
  blurUrl?: string;           // blur_image for fade-in placeholder
  onFileChange: (file: File | null) => void;
  label?: string;
  required?: boolean;
  aspectRatio?: string;
}

const ImageInput: React.FC<ImageInputProps> = ({
  currentUrl, blurUrl, onFileChange, label = 'Image', required, aspectRatio = '16/9'
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [realLoaded, setRealLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f) { setPreview(URL.createObjectURL(f)); setRemoved(false); setRealLoaded(false); onFileChange(f); }
  };
  const handleRemove = () => { setPreview(null); setRemoved(true); setRealLoaded(false); onFileChange(null); if (inputRef.current) inputRef.current.value = ''; };
  const handleEdit   = () => inputRef.current?.click();
  const handleDrop   = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('image/')) { setPreview(URL.createObjectURL(f)); setRemoved(false); setRealLoaded(false); onFileChange(f); }
  };

  const showExisting = preview || (currentUrl && !removed);
  const displayUrl   = preview || currentUrl;

  const wrapper: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6 };
  const labelStyle: React.CSSProperties = { fontFamily: 'Montserrat,sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0A142F' };

  return (
    <div style={wrapper}>
      <label style={labelStyle}>{label} {required && <span style={{ color: '#C8102E' }}>*</span>}</label>

      {showExisting ? (
        <div
          style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: '#0A142F', aspectRatio }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Blur placeholder — shown until real image loads */}
          {blurUrl && !preview && (
            <img
              src={blurUrl}
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', filter: 'blur(20px)', transform: 'scale(1.1)',
                opacity: realLoaded ? 0 : 1, transition: 'opacity 0.5s ease',
                pointerEvents: 'none',
              }}
            />
          )}
          {/* Real image */}
          <img
            src={displayUrl}
            alt={label}
            onLoad={() => setRealLoaded(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              opacity: realLoaded ? 1 : (blurUrl && !preview ? 0 : 1),
              transition: 'opacity 0.5s ease',
            }}
          />
          {/* New badge */}
          {preview && (
            <span style={{ position: 'absolute', top: 8, left: 8, background: '#16a34a', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontFamily: 'Montserrat,sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>New</span>
          )}
          {/* Hover actions */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,10,23,0.52)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: hovered ? 1 : 0, transition: 'opacity 0.2s' }}>
            <button style={{ width: 40, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#0A142F', transition: 'all 0.2s' }} onClick={handleEdit} title="Change image"><Pencil size={16} /></button>
            <button style={{ width: 40, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#C8102E', color: '#fff', transition: 'all 0.2s' }} onClick={handleRemove} title="Remove image"><Trash2 size={16} /></button>
          </div>
        </div>
      ) : (
        <div
          style={{ border: '2px dashed rgba(200,16,46,0.35)', borderRadius: 10, padding: '28px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', background: 'rgba(200,16,46,0.03)', transition: 'all 0.2s', aspectRatio }}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#C8102E')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(200,16,46,0.35)')}
        >
          <Upload size={28} style={{ color: 'rgba(200,16,46,0.5)' }} />
          <span style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(200,16,46,0.6)' }}>Click or drag image here</span>
          <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#9CA3AF' }}>PNG, JPG, WebP — max 10MB</span>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  );
};

export default ImageInput;
