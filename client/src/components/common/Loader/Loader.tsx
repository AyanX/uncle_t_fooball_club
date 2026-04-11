import React from 'react';
import { PuffLoader } from 'react-spinners';
import styles from './Loader.module.scss';

interface LoaderProps {
  size?: number;
  fullHeight?: boolean;
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 60,
  fullHeight = false,
  color = '#F1C40F', 
}) => (
  <div className={`${styles.loader} ${fullHeight ? styles.fullHeight : ''}`}>
    <PuffLoader color={color} size={size} speedMultiplier={0.9} />
  </div>
);

export default Loader;
