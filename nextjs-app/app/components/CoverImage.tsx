import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image'; // Assuming standard path for urlForImage

interface CoverImageProps {
  title?: string;
  image: any;
  priority?: boolean;
  className?: string;
}

export default function CoverImage({
  title = '',
  image,
  priority = false,
  className,
}: CoverImageProps) {
  const sourceImage = image;
  if (!sourceImage?.asset) {
    // Optionally return a placeholder or null if no image asset
    return <div className={className} style={{ minHeight: '200px', background: '#eee' }} > {/* Basic placeholder */}</div>;
  }

  const imageUrl = urlForImage({ source: sourceImage });
  if (!imageUrl) {
    // Optionally return a placeholder or null if URL generation fails
    return <div className={className} style={{ minHeight: '200px', background: '#f5f5f5' }} > {/* Basic placeholder */}</div>;
  }

  return (
    <div className={className}> {/* Ensure this div has position:relative or the className provides it for fill to work */}
      <Image
        src={imageUrl}
        alt={title ? `Cover Image for ${title}` : 'Cover Image'}
        priority={priority}
        width={1000}
        height={1000}
        // sizes="100vw"
        className="object-cover w-full h-auto"
      />
    </div>
  );
}
