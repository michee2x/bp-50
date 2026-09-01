import Image from 'next/image';
import Link from 'next/link';

type BrandPawaLogoProps = {
  href?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap = {
  sm: 'h-9',
  md: 'h-10 sm:h-11',
  lg: 'h-14 sm:h-16',
};

export function BrandPawaLogo({
  href = '/',
  priority = false,
  className = '',
  imageClassName = '',
  size = 'md',
}: BrandPawaLogoProps) {
  const logo = (
    <Image
      src="/images/BrandPawa logo2.png"
      alt="BrandPawa"
      width={160}
      height={64}
      priority={priority}
      className={`w-auto object-contain ${sizeMap[size]} ${imageClassName}`.trim()}
    />
  );

  if (!href) {
    return <div className={className}>{logo}</div>;
  }

  return (
    <Link href={href} className={`inline-flex items-center ${className}`.trim()}>
      {logo}
    </Link>
  );
}
