"use client";
import * as React from 'react';
import type { AdvancedListBlock as AdvancedListBlockType } from "@/types/sanity.types";
import { PortableText } from '@portabletext/react';
import Heading from '@/app/components/Heading';
import { components } from '.';
import { cn } from '@/app/lib/utils';
import { stegaClean } from "@sanity/client/stega";
import BlockBGColor from './BlockBGColor';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

// Local enum for text alignment to corresponding flex classes
enum flexDirection {
  left = "justify-start",
  center = "justify-center",
  right = "justify-end",
}

// Local enum for vertical alignment to corresponding flex classes
enum vAlignItems {
  top = "items-start",
  center = "items-center",
  bottom = "items-end",
}

interface IAdvancedListBlockProps {
  block: AdvancedListBlockType;
}

export const AdvancedListBlock: React.FunctionComponent<IAdvancedListBlockProps> = (props) => {
  const { heading, listItems, options } = props.block;

  const cleanedTextAlign = options?.textAlign ? stegaClean(options.textAlign) : 'left';
  const textAlignClass = flexDirection[cleanedTextAlign as keyof typeof flexDirection] || flexDirection.left;

  const cleanedVAlign = options?.vAlign ? stegaClean(options.vAlign) : 'top';
  const vAlignClass = vAlignItems[cleanedVAlign as keyof typeof vAlignItems] || vAlignItems.top;

  const cleanedOrientation = options?.orientation ? stegaClean(options.orientation) : 'vertical';

  const ListItems = listItems?.map((item, idx) => {
    if (!item) return null;

    const imageField = item.image;
    const imageAsset = imageField?.asset;
    let imageUrl: string | null = null;
    // Alt text: Using a generic fallback as item.image type doesn't guarantee 'alt' or 'altText'.
    // For specific alt text, Sanity schema/query for AdvancedListBlock listItems would need to provide it.
    const imageAltText: string = 'List item image';

    if (imageAsset && imageField) { // Ensure imageField is also defined before passing to urlForImage
      imageUrl = urlForImage({ source: imageField, width: 30, height: 30 });
    }

    return (
      <li key={item._key || idx} className="list-none p-0 m-0">
        <div className={cn("flex gap-4", vAlignClass)}>
          {imageUrl && imageField && (
            <div className="flex-shrink-0">
              <Image
                src={imageUrl}
                alt={imageAltText}
                width={30}
                height={30}
              />
            </div>
          )}
          {item.body && (
            <div className="flex-grow">
              {item.body && <PortableText value={item.body} components={components} />}
            </div>
          )}
        </div>
      </li>
    );
  });

  return (
    <BlockBGColor blockTheme={options?.blockTheme} fullWidth={options?.bgFullWidth || false}>
      <div className={cn(
        textAlignClass
      )}>
        {heading?.text && <Heading text={heading.text} level={heading.level || 2} className='mb-8' />}
        {options?.type === 'bullet' ? (
          <ul
            className={cn(
              "flex w-full",
              cleanedOrientation === "horizontal" ? "flex-col lg:flex-row responsive-gap" : "flex-col gap-4",
              textAlignClass
            )}
          >
            {ListItems}
          </ul>
        ) : (
          <ol className={cn(
            "flex w-full items-center responsive-gap",
            cleanedOrientation === "horizontal" ? "flex-col lg:flex-row responsive-gap" : "flex-col gap-4",
            textAlignClass
          )}>
            {ListItems}
          </ol>
        )}
      </div>
    </BlockBGColor>
  );
};

export default AdvancedListBlock;
