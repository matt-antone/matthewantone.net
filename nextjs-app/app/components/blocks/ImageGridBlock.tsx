import * as React from 'react';
import type { ImageGridBlock as ImageGridBlockType } from "@/types/sanity.types";
import { BlockBGColor } from '../blocks/BlockBGColor';
import { cn } from '@/app/lib/utils';
import Heading from '../Heading';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

interface IImageGridProps {
  block: ImageGridBlockType
}

const columns = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
} as const;

// Helper to generate sizes attribute based on column count
const getSizesForColumns = (cols: number): string => {
  if (cols === 1) return "100vw";
  const colPercentage = Math.floor(100 / cols);
  return `(max-width: 768px) 100vw, (max-width: 1200px) ${colPercentage * 2}vw, ${colPercentage}vw`;
};

export const ImageGridBlock: React.FunctionComponent<IImageGridProps> = (props) => {
  const { block: { images, options, heading } } = props;
  const columnCount = Math.min(Math.max(1, options?.columns || 2), 12) as keyof typeof columns;

  return images && images.length > 0 ? (
    <div className="">
      <BlockBGColor blockTheme={options?.blockTheme || ''} fullWidth={options?.bgFullWidth || false}>
        <div className="flex flex-col responsive-gap-sm">
          {heading && <Heading text={heading.text || ""} level={heading.level || 2} />}
          <div className={cn("grid bg-transparent responsive-gap-sm", columns[columnCount])}>
            {images.map((item, index) => {
              const { customImage } = item;
              if (!customImage?.image?.asset) return null;

              const sourceImage = customImage.image;
              const imageUrl = urlForImage({ source: sourceImage });
              if (!imageUrl) return null;

              return (
                <div key={item._key || index} className="relative aspect-square overflow-hidden rounded-md">
                  <Image
                    src={imageUrl}
                    alt={customImage.altText || 'Image grid item'}
                    fill
                    loading="lazy"
                    sizes={getSizesForColumns(columnCount)}
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </BlockBGColor>
    </div>
  ) : null;
};

export default ImageGridBlock;
