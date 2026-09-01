export type SocialPlatform = 'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'instagram';

type ShareComposerInput = {
  title: string;
  text: string;
  url?: string;
  file?: File;
  preferTextOnly?: boolean;
};

type ShareCardInput = {
  eyebrow: string;
  title: string;
  subtitle: string;
  accentStart: string;
  accentEnd: string;
  badge: string;
  highlight: string;
  footer: string;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const BRANDPAWA_SITE_URL = 'https://brandpawa.com';

export function createShareCardSvg(input: ShareCardInput) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${input.accentStart}" />
          <stop offset="100%" stop-color="${input.accentEnd}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" rx="0" fill="url(#bg)" />
      <circle cx="1020" cy="120" r="180" fill="rgba(255,255,255,0.08)" />
      <circle cx="180" cy="560" r="140" fill="rgba(255,255,255,0.08)" />
      <rect x="78" y="72" width="1044" height="486" rx="36" fill="rgba(10,12,22,0.22)" stroke="rgba(255,255,255,0.14)" />
      <text x="120" y="132" fill="rgba(255,255,255,0.72)" font-size="24" font-family="Arial, Helvetica, sans-serif" letter-spacing="4">${escapeXml(input.eyebrow)}</text>
      <text x="120" y="214" fill="#ffffff" font-size="58" font-weight="700" font-family="Arial, Helvetica, sans-serif">${escapeXml(input.title)}</text>
      <text x="120" y="274" fill="rgba(255,255,255,0.84)" font-size="28" font-family="Arial, Helvetica, sans-serif">${escapeXml(input.subtitle)}</text>
      <rect x="120" y="336" width="280" height="116" rx="28" fill="rgba(255,255,255,0.14)" />
      <text x="160" y="380" fill="rgba(255,255,255,0.72)" font-size="22" font-family="Arial, Helvetica, sans-serif">${escapeXml(input.badge)}</text>
      <text x="160" y="430" fill="#ffffff" font-size="44" font-weight="700" font-family="Arial, Helvetica, sans-serif">${escapeXml(input.highlight)}</text>
      <text x="120" y="520" fill="rgba(255,255,255,0.88)" font-size="24" font-family="Arial, Helvetica, sans-serif">${escapeXml(input.footer)}</text>
      <text x="1000" y="530" fill="rgba(255,255,255,0.76)" font-size="30" font-weight="700" text-anchor="end" font-family="Arial, Helvetica, sans-serif">BrandPawa</text>
    </svg>
  `.trim();
}

async function rasterizeSvgToPng(svg: string) {
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () => reject(new Error('Unable to render score card image.'));
      nextImage.src = svgUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas rendering is unavailable.');
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error('Unable to export score card image.'));
      }, 'image/png');
    });

    return pngBlob;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

export async function createShareCardFile(input: ShareCardInput, filename: string) {
  const svg = createShareCardSvg(input);
  const blob = await rasterizeSvgToPng(svg);
  const normalizedFilename = filename.replace(/\.[a-z0-9]+$/i, '') || 'brandpawa-share-card';
  return new File([blob], `${normalizedFilename}.png`, { type: 'image/png' });
}

export async function shareViaNative(input: ShareComposerInput) {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return false;
  }

  try {
    const payload: ShareData = {
      title: input.title,
      text: input.text,
    };

    if (input.url) {
      payload.url = input.url;
    }

    if (!input.preferTextOnly && input.file && navigator.canShare?.({ files: [input.file] })) {
      payload.files = [input.file];
    }

    await navigator.share(payload);
    return true;
  } catch (error) {
    console.error('Native share failed:', error);
    return false;
  }
}

export function openSocialComposer(platform: SocialPlatform, input: ShareComposerInput) {
  const shareUrl = input.url || BRANDPAWA_SITE_URL;
  const shareText = input.text;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedQuote = encodeURIComponent(shareText);

  const urls: Record<SocialPlatform, string> = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedQuote}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    instagram: '',
  };

  if (!urls[platform]) {
    return;
  }

  window.open(urls[platform], '_blank', 'noopener,noreferrer');
}

export async function shareImageOnly(file: File, title: string) {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return false;
  }

  try {
    if (!navigator.canShare?.({ files: [file] })) {
      return false;
    }

    await navigator.share({
      title,
      files: [file],
    });
    return true;
  } catch (error) {
    console.error('Image share failed:', error);
    return false;
  }
}

export function downloadFile(file: File) {
  const objectUrl = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
