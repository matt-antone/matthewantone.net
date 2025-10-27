'use client'

import { useState } from 'react'
import Image from 'next/image';
import { CustomImage, type GalleryBlock as GalleryBlockType } from '@/types/sanity.types'
import { urlForImage } from '@/sanity/lib/image'
import { v4 as uuidv4 } from 'uuid';
import cn from 'classnames'
import Heading from '../Heading'
import { stegaClean } from "@sanity/client/stega";
import BlockBGColor from './BlockBGColor';

interface IGalleryBlockProps {
  block: GalleryBlockType
}
export const GalleryBlock: React.FunctionComponent<IGalleryBlockProps> = (props) => {
  const { heading, images, options } = props.block
  const [selectedImage, setSelectedImage] = useState(0)

  if (!images?.length) return null

  const columns = [
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-5',
    'grid-cols-6',
    'grid-cols-7',
    'grid-cols-8',
    'grid-cols-9',
    'grid-cols-10',
    'grid-cols-11',
    'grid-cols-12',
  ]

  // const url = urlForImage({ source: images[selectedImage].image as SanityImageSource, width: 1200, height: 900 }) // Removed, OptimizedImage will handle URL generation

  return (
    <BlockBGColor blockTheme={options?.blockTheme || ''} fullWidth={options?.bgFullWidth || false}>
      {heading?.text && <Heading text={heading.text} level={heading.level || 1} className='mb-8' />}
      <div className={cn(
        "flex flex-col responsive-gap-sm",
        stegaClean(options?.width || "") === "limited" && "max-w-1/2 mx-auto",
      )}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
          {(() => {
            const mainImageSource = images[selectedImage]?.image;
            if (!mainImageSource?.asset) return null;
            const mainImageUrl = urlForImage({ source: mainImageSource });
            if (!mainImageUrl) return null;
            return (
              <Image
                src={mainImageUrl}
                alt={images[selectedImage].altText || "Gallery image"}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 50vw, 640px"
                priority
                className="object-cover"
              />
            );
          })()}
        </div>
        <div className={cn(
          'grid responsive-gap-sm',
          columns[images.length > 12 ? 11 : images.length - 1]
        )}>
          {images.map((imageItem: CustomImage, index) => {
            const thumbImageSource = imageItem.image;
            if (!thumbImageSource?.asset) return null;
            const thumbImageUrl = urlForImage({ source: thumbImageSource });
            if (!thumbImageUrl) return null;

            return (
              <button
                key={uuidv4()}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-[4/3] overflow-hidden rounded-lg ${selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
              >
                <Image
                  src={thumbImageUrl}
                  alt={imageItem.altText || "Gallery thumbnail"}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 25vw, 15vw"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </BlockBGColor>


  )
}

export default GalleryBlock;
