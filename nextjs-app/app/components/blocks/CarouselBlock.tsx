"use client"
import * as React from 'react';
import { BlockContent, CarouselBlock as CarouselBlockType, CustomImage } from '@/types/sanity.types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel"
import { PortableText } from '@portabletext/react';
import { v4 as uuidv4 } from 'uuid';
import { components } from '.';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import { Heading } from '@/app/components/Heading';
import BlockBGColor from './BlockBGColor';

interface ICarouselBlockProps {
  block: CarouselBlockType
}

export const CarouselBlock: React.FunctionComponent<ICarouselBlockProps> = ({ block }) => {
  const { heading, images, options } = block
  return (
    <section>
      <BlockBGColor blockTheme={options?.blockTheme as string} fullWidth={options?.bgFullWidth || false}>
        {heading?.text && <Heading text={heading.text} level={heading.level || 1} className='mb-8' />}
        <Carousel className='w-full not-prose max-w-[90%] mx-auto' opts={{ loop: true }}>
          <CarouselContent>
            {images?.map((slide, index) => {
              const customImage = slide.image as CustomImage | undefined;
              const sourceImage = customImage?.image;
              const altText = customImage?.altText || heading?.text || 'Carousel image';

              if (!sourceImage?.asset) return null;
              const imageUrl = urlForImage({ source: sourceImage });
              if (!imageUrl) return null;

              return (
                <CarouselItem key={uuidv4()} className='relative p-0 w-full'>
                  <figure className='relative w-full aspect-[16/9]'>
                    <Image
                      src={imageUrl}
                      alt={altText}
                      fill
                      priority={index === 0}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      className="object-cover"
                    />
                    <figcaption className='portable-text-block p-8 pl-12 absolute bg-black/50 text-white prose prose-white w-full top-0 bottom-0 left-0 before:content-[""] max-w-none flex items-end'>
                      <PortableText value={slide.body as BlockContent} components={components} />
                    </figcaption>
                  </figure>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </BlockBGColor>
    </section>
  );
};

export default CarouselBlock;
