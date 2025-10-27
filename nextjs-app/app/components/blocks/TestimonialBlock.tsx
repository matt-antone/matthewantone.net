import * as React from 'react';
import type { TestimonialBlock as TestimonialBlockType } from '@/types/sanity.types';
import { PiStarDuotone } from "react-icons/pi";
import BlockBGColor from './BlockBGColor';
import Heading from '../Heading';
import { cn } from '@/app/lib/utils';
import { stegaClean } from "@sanity/client/stega";
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import { SanityImage } from "@/app/components/SanityImage";
import { BlockThemes, TextAlign } from "./_classes";

interface ITestimonialBlockProps {
  block: TestimonialBlockType;
}

export const TestimonialBlock: React.FunctionComponent<ITestimonialBlockProps> = ({ block }) => {
  const authorImage = block.author?.image?.image;

  return (
    <BlockBGColor blockTheme={block.options?.blockTheme as string} fullWidth={block.options?.bgFullWidth || false}>
      <div className="flex flex-col responsive-gap-sm">
        {block.heading && <Heading text={block.heading.text || ""} level={block.heading.level || 2} />}
        <blockquote className="text-d5 w-2/3 mx-auto">
          {block.quote}
          {block.author && (
            <cite className={cn(
              "mt-4 flex gap-4 items-center",
              block.options?.textAlign && stegaClean(block.options?.textAlign) === "center" && "justify-center",
              TextAlign[block.options?.textAlign as keyof typeof TextAlign],
              BlockThemes[block.options?.blockTheme as keyof typeof BlockThemes]
            )}>
              {(() => {
                if (!authorImage?.asset?._ref) return null;
                const imageUrl = urlForImage({ source: authorImage, width: 40, height: 40 });
                if (!imageUrl) return null;
                return (
                  <Image
                    src={imageUrl}
                    alt={block.author?.name || "Author image"}
                    width={40}
                    height={40}
                    className="rounded-full my-0"
                    sizes="40px"
                  />
                );
              })()}
              <span className="text-lg font-bold">{block.author.name}</span>
              <span className="flex gap-1">
                {block.rating && Array.from({ length: block.rating }).map((_, index) => (
                  <PiStarDuotone key={index} className="w-5 h-5 text-yellow-500" />
                ))}
              </span>
            </cite>)}
        </blockquote>
      </div>
    </BlockBGColor>
  );
};

export default TestimonialBlock;
