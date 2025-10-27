"use client";
import * as React from 'react';
import type { SlideshowBlock as SlideshowBlockType, CustomImage } from '@/types/sanity.types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { v4 as uuidv4 } from 'uuid';
import BlockBGColor from './BlockBGColor';
import Heading from '../Heading';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

interface ISlideshowBlockProps {
  block: SlideshowBlockType
}

// Define the type for items in the images array, including _key
type SlideshowItem = CustomImage & { _key: string };

export const SlideshowBlock: React.FunctionComponent<ISlideshowBlockProps> = (props) => {
  const { block: { images, options, heading } } = props;

  const autoplayEnabled = options?.autoplay !== undefined ? options.autoplay : true;
  const delay = (options?.interval || 5) * 1000;

  const plugin = React.useRef(
    Autoplay({ delay, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  return (
    <div className="">
      <BlockBGColor blockTheme={options?.blockTheme || ''} fullWidth={options?.bgFullWidth || false}>
        <div className="flex flex-col responsive-gap-sm">
          {heading && <Heading text={heading.text || ''} level={heading.level || 2} />}
          <div className="px-4 sm:px-8 md:px-16">
            <Carousel
              opts={{ loop: true }}
              plugins={autoplayEnabled ? [plugin.current] : []}
            >
              <CarouselContent>
                {images?.map((slideItem: SlideshowItem, index) => {
                  if (!slideItem?.image?.asset) {
                    return null;
                  }

                  const sourceImage = slideItem.image;
                  const altText = slideItem.altText || heading?.text || `Slideshow image ${index + 1}`;
                  const imageUrl = urlForImage({ source: sourceImage });

                  if (!imageUrl) return null;

                  return (
                    <CarouselItem key={slideItem._key || uuidv4()} className="relative aspect-[16/9]">
                      <Image
                        src={imageUrl}
                        alt={altText}
                        fill
                        priority={index === 0}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        className="object-cover"
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </BlockBGColor>
    </div>
  );
};

export default SlideshowBlock;
