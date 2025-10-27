import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

export interface IImageBlockProps {
  block: {
    _type: 'image';
    _key: string;
    asset: {
      _ref: string;
      _type: 'reference';
    };
  };
}

interface ImageBlockProps {
  image: any;
  alt?: string;
  caption?: string;
  className?: string;
}

export function ImageBlock(props: IImageBlockProps | ImageBlockProps) {
  // Handle old interface
  if ('block' in props) {
    const sourceImage = props.block.asset;
    if (!sourceImage?._ref) return null; // Check _ref for asset reference validity

    const imageUrl = urlForImage({ source: sourceImage, width: 1200, height: 800, quality: 85 });
    if (!imageUrl) return null;

    return (
      <figure className="mx-auto">
        <Image
          src={imageUrl}
          alt="" // Original alt
          width={1200}
          height={800}
          quality={85}
          className="rounded-lg"
          sizes="(max-width: 1200px) 100vw, 1200px" // Added sizes
        />
      </figure>
    );
  }

  // Handle new interface
  const { image, alt = '', caption, className } = props;
  const sourceImageNew = image;
  // Assuming 'image' in new interface is a full Sanity image object with an asset property
  if (!sourceImageNew?.asset?._ref) return null;

  const imageUrlNew = urlForImage({ source: sourceImageNew, width: 1200, height: 800, quality: 85 });
  if (!imageUrlNew) return null;

  return (
    <figure className={className}>
      <Image
        src={imageUrlNew}
        alt={alt}
        width={1200}
        height={800}
        quality={85}
        className="rounded-lg"
        sizes="(max-width: 1200px) 100vw, 1200px" // Added sizes
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-500 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
