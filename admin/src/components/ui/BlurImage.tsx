import React, { useState } from 'react';

interface BlurImageProps {
  src: string;
  blurSrc?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  objectPosition?: string;
}

const BlurImage: React.FC<BlurImageProps> = ({ src, blurSrc, alt, className, style, objectPosition = 'center' }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Blur placeholder */}
      {blurSrc && (
        <img
          src={blurSrc}
          aria-hidden="true"
          alt=""
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition,
            filter: 'blur(20px)', transform: 'scale(1.08)',
            opacity: loaded ? 0 : 1,
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Real image */}
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition,
          opacity: loaded ? 1 : (blurSrc ? 0 : 1),
          transition: 'opacity 0.5s ease',
          display: 'block',
          ...style,
        }}
      />
    </div>
  );
};

export default BlurImage;
