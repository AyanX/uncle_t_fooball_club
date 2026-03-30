// BlurImage.tsx — Progressive image loading with blur placeholder
import React, { useState } from 'react';
import styles from './BlurImage.module.scss';

interface BlurImageProps {
  src: string;
  blur_image?: string;
  alt: string;
  className?: string;
  objectPosition?: string;
}

const BlurImage: React.FC<BlurImageProps> = ({
  src, blur_image, alt, className = '', objectPosition = 'center',
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {blur_image && (
        <img
          src={blur_image}
          alt=""
          aria-hidden
          className={`${styles.blur} ${loaded ? styles.blurHidden : ''}`}
          style={{ objectPosition }}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`${styles.image} ${loaded ? styles.imageVisible : ''}`}
        style={{ objectPosition }}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};

export default BlurImage;
