import React, { useState } from 'react';
import {
  CATEGORY_FALLBACK_IMAGES,
  getBeigePlaceholderSvg,
  extractCleanImageFilename,
} from '../utils/imageFallback';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  category?: string;
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Clotex artisanal product',
  category,
  fallbackLabel,
  className = '',
  ...props
}) => {
  // stage: 0 = primary src, 1 = public/images relative path, 2 = CDN fallback, 3 = SVG Data URI
  const [stage, setStage] = useState(0);

  const cleanName = src ? extractCleanImageFilename(src) : null;
  const categoryFallback = category
    ? CATEGORY_FALLBACK_IMAGES[category] || CATEGORY_FALLBACK_IMAGES.Dresses
    : CATEGORY_FALLBACK_IMAGES.Dresses;

  let currentSrc = src || '';
  if (stage === 1 && cleanName) {
    // Try clean local public path relative to app root
    currentSrc = `./images/${cleanName}`;
  } else if (stage === 2) {
    currentSrc = categoryFallback;
  } else if (stage >= 3) {
    currentSrc = getBeigePlaceholderSvg(fallbackLabel || category || 'CLOTEX');
  }

  const handleError = () => {
    if (stage < 3) {
      setStage((prev) => prev + 1);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading="lazy"
      onError={handleError}
      className={className}
      {...props}
    />
  );
};
