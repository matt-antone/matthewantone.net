"use client";
import * as React from 'react';
import { HeroBlock as HeroBlockType, BlockContent, CustomImage } from '@/types/sanity.types';
import { cn } from '@/app/lib/utils';
import { components } from '../blocks';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

interface IHeroBlockProps {
  block: HeroBlockType
}

export const HeroBlock: React.FunctionComponent<IHeroBlockProps> = ({ block }) => {
  const { image: customImage, valueProposition, options } = block;
  const [imageHasLoaded, setImageHasLoaded] = React.useState(false);

  const sourceImage = (customImage as CustomImage)?.image;
  const altText = (customImage as CustomImage)?.altText || "Hero background image";

  const fullWidthClass = options?.bgFullWidth ? "w-screen relative left-1/2 -translate-x-1/2" : "mx-auto";

  const imageUrl = sourceImage?.asset ? urlForImage({ source: sourceImage }) : null;

  React.useEffect(() => {
    if (!imageUrl && !sourceImage?.asset) {
      setImageHasLoaded(true);
    }
  }, [imageUrl, sourceImage, setImageHasLoaded]);

  return (
    <div className={cn('relative', fullWidthClass)}>
      <div className="relative h-[700px] overflow-hidden">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={altText}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            onLoad={() => setImageHasLoaded(true)}
            onError={() => {
              console.warn(`Hero image failed to load: ${altText}`);
              setImageHasLoaded(true);
            }}
          />
        )}

        {imageHasLoaded && (
          <div className={cn(
            "absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4 md:p-8"
          )}>
            <div className={cn(options?.bgFullWidth ? "mx-auto px-4" : "w-full")}>
              <PortableText value={valueProposition as BlockContent} components={components} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroBlock;