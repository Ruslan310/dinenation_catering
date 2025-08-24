'use client';

import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = '/placeholder-food.svg',
  fill = false,
  width,
  height,
  className,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  if (fill) {
    return (
      <div className={`image-with-fallback fill ${className || ''}`}>
        <img
          src={imgSrc}
          alt={alt}
          className={hasError ? 'error' : ''}
          onError={handleError}
        />
        {hasError && (
          <div className="fallback-overlay">
            <div>
              <div className="fallback-icon">🍽️</div>
              <div className="fallback-text">Image not available</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`image-with-fallback ${className || ''}`}>
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={hasError ? 'error' : ''}
        onError={handleError}
      />
      {hasError && (
        <div className="fallback-overlay">
          <div>
            <div className="fallback-icon">🍽️</div>
            <div className="fallback-text">Image not available</div>
          </div>
        </div>
      )}
    </div>
  );
}
