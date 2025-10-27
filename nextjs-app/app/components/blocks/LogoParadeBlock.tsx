import * as React from 'react';
import { LogoParadeBlock as LogoParadeBlockType, CustomImage } from '@/types/sanity.types';
import Image from 'next/image'; // Restoring this
import { urlForImage } from '@/sanity/lib/image'; // Restoring this
// import { OptimizedImage } from '@/app/components/ui/optimized-image'; // Removing this
import { v4 as uuidv4 } from 'uuid';
import BlockBGColor from './BlockBGColor';
import Heading from '../Heading';

interface ILogoParadeBlockProps {
  block: LogoParadeBlockType
}

// Define the type for items in the images array, including _key
type LogoItem = CustomImage & { _key: string };

export const LogoParadeBlock: React.FunctionComponent<ILogoParadeBlockProps> = (props) => {
  const { block: { images, options, heading } } = props;
  return (
    <BlockBGColor blockTheme={options?.blockTheme || ''} fullWidth={options?.bgFullWidth || false}>
      <div className="flex flex-col responsive-gap-sm">
        {heading && <Heading text={heading.text || ''} level={heading.level || 2} />}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
          {images?.map((logoItem: CustomImage & { _key: string }) => {
            if (!logoItem.image?.asset) return null;

            const sourceImage = logoItem.image;
            const imageUrl = urlForImage({ source: sourceImage });
            if (!imageUrl) return null;

            return (
              <div key={logoItem._key || uuidv4()} className="w-24 h-24 relative">
                <Image
                  src={imageUrl}
                  alt={logoItem.altText || "Logo"}
                  fill
                  loading="lazy"
                  sizes="96px"
                  className="object-contain"
                />
              </div>
            );
          })}
        </div>
      </div>
    </BlockBGColor>
  );
};

export default LogoParadeBlock;
