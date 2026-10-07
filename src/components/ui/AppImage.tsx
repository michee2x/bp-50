import React from 'react';
import Image, { ImageProps } from 'next/image';

interface AppImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  unoptimized?: boolean;
}

export default function AppImage({ src, alt, unoptimized = true, ...props }: AppImageProps) {
  return (
    <Image 
      src={src} 
      alt={alt} 
      unoptimized={unoptimized} 
      {...props} 
    />
  );
}
