import React from 'react';
import { ImageProps } from 'next/image';

interface AppImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  unoptimized?: boolean;
}

export default function AppImage({ src, alt, unoptimized, fill, ...props }: AppImageProps) {
  // Use standard img tag to bypass Next.js domain restrictions completely
  // If 'fill' was passed (for next/image), we map it to absolute positioning styles
  return (
    <img 
      src={src} 
      alt={alt} 
      style={fill ? { position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0, objectFit: 'cover' } : undefined}
      {...props as any} 
    />
  );
}
