import Image from 'next/image';

type BrandLoaderProps = {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'page';
  className?: string;
  textClassName?: string;
};

const sizeMap = {
  sm: {
    shell: 'h-5 w-5 rounded-lg',
    text: 'text-xs',
  },
  md: {
    shell: 'h-12 w-12 sm:h-14 sm:w-14',
    text: 'text-sm sm:text-base',
  },
  lg: {
    shell: 'h-16 w-16 sm:h-20 sm:w-20',
    text: 'text-base sm:text-lg',
  },
};

export function BrandLoader({
  label,
  size = 'md',
  variant = 'page',
  className = '',
  textClassName = '',
}: BrandLoaderProps) {
  const sizeClasses = sizeMap[size];
  const isInline = variant === 'inline';

  return (
    <div
      className={`flex ${isInline ? 'items-center gap-2' : 'flex-col items-center justify-center'} ${className}`.trim()}
    >
      <div
        className={`overflow-hidden bg-white/70 shadow-lg ring-1 ring-purple-100 ${sizeClasses.shell}`.trim()}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          className="h-full w-full object-cover"
        >
          <source src="/videos/brandpawa-loading.mp4" type="video/mp4" />
        </video>
      </div>

      <noscript>
        <Image
          src="/images/BrandPawa logo2.png"
          alt="BrandPawa"
          width={160}
          height={64}
          className="h-10 w-auto object-contain"
        />
      </noscript>

      {label ? (
        <p className={`text-gray-600 ${sizeClasses.text} ${textClassName}`.trim()}>{label}</p>
      ) : null}
    </div>
  );
}
