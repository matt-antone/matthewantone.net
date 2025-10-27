import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import { cn } from '@/lib/utils'; // For combining classNames
import * as React from 'react'; // For React.CSSProperties

interface SanityImageProps {
  image: any;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  quality?: number;
  sizes?: string;
  fill?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'; // Added objectFit
  style?: React.CSSProperties;
  onError?: () => void;
}

export function SanityImage({
  image,
  alt = '',
  width,
  height,
  className,
  priority = false,
  loading = 'lazy',
  quality = 80,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  objectFit = 'cover', // Default objectFit
  style,
  onError,
}: SanityImageProps) {
  const sourceImage = image;

  if (!sourceImage?.asset) {
    // Optional: Render a placeholder or null
    // This basic placeholder tries to respect width/height/fill from props
    const placeholderStyle: React.CSSProperties = {
      background: '#eee',
      display: 'inline-block',
      ...style,
    };
    if (fill) {
      placeholderStyle.width = '100%';
      placeholderStyle.height = '100%';
    } else {
      if (width) placeholderStyle.width = width;
      if (height) placeholderStyle.height = height;
    }
    return <div className={cn("sanity-image-placeholder", className)} style={placeholderStyle} />;
  }

  const urlBuilderOptions: Parameters<typeof urlForImage>[0] = { source: sourceImage, quality };

  if (fill) {
    // If fill is true, pass width/height to urlForImage only if they are explicitly provided to SanityImage
    // This requests a specifically sized version from Sanity for next/image to fill with.
    // If not provided, urlForImage gets the natural image, and next/image (with sizes) handles responsiveness.
    if (width) urlBuilderOptions.width = width;
    if (height) urlBuilderOptions.height = height;
  } else {
    // If not fill, width and height are for fixed size image. Use defaults if not provided.
    urlBuilderOptions.width = width || 800; // Default fixed width
    urlBuilderOptions.height = height || 600; // Default fixed height
  }

  const imageUrl = urlForImage(urlBuilderOptions);

  if (!imageUrl) {
    // Handle URL generation failure (similar placeholder logic)
    const placeholderStyle: React.CSSProperties = { background: '#ddd', display: 'inline-block', ...style };
    if (fill) {
      placeholderStyle.width = '100%';
      placeholderStyle.height = '100%';
    } else {
      if (width) placeholderStyle.width = width;
      if (height) placeholderStyle.height = height;
    }
    return <div className={cn("sanity-image-placeholder-url-fail", className)} style={placeholderStyle} />;
  }

  // Mimic OptimizedImage's wrapper div for className and style application
  // However, next/image with fill=true doesn't use width/height for layout directly,
  // it relies on the parent. So the wrapper needs to be styled correctly if fill is true.
  const imageProps = {
    src: imageUrl,
    alt,
    priority,
    loading,
    quality,
    sizes,
    onError,
    fill,
    style: fill ? undefined : style,
    width: fill ? undefined : (urlBuilderOptions.width ?? (width || 800)),
    height: fill ? undefined : (urlBuilderOptions.height ?? (height || 600)),
  };

  const objectFitClass =
    objectFit === 'contain' ? 'object-contain' :
      objectFit === 'fill' ? 'object-fill' :
        objectFit === 'none' ? 'object-none' :
          objectFit === 'scale-down' ? 'object-scale-down' :
            'object-cover'; // Default to object-cover

  if (fill) {
    return (
      <div className={cn("relative w-full h-full", className)} style={style}>
        <Image {...imageProps} className={objectFitClass} />
      </div>
    );
  } else {
    return <Image {...imageProps} className={cn(className, objectFitClass)} />;
  }
}
