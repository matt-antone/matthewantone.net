import type { FeaturesBlock } from "@/types/sanity.types";
import Heading from "../../../Heading";
import { columns, type Feature } from "../index";
import { v4 as uuidv4 } from 'uuid';
import { BlockBGColor } from "../../BlockBGColor";
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

// These constants appear unused after the refactor.
// const width = 150;
// const height = 150;

export const FeaturesDefault: React.FunctionComponent<FeaturesBlock> = (props) => {
  const { heading, features, options } = props
  return (
    <BlockBGColor blockTheme={options?.blockTheme || ''} fullWidth={options?.bgFullWidth || false}>
      {heading?.text && <Heading text={heading.text} level={heading.level || 1} className='mb-8' />}
      <div className={`grid grid-cols-1 ${columns[options?.columns ? options.columns - 1 : 2]} responsive-gap items-start`}>
        {features?.map((feature: Feature) => {
          const iconImage = feature.icon?.image;

          if (!iconImage?.asset) return null;
          const imageUrl = urlForImage({ source: iconImage });
          if (!imageUrl) return null;

          return (
            <div key={uuidv4()} className="flex flex-col items-center gap-4 text-center">
              <div className="relative w-[150px] h-[150px]">
                <Image
                  src={imageUrl}
                  alt={feature.title ? `${feature.title} icon` : "Feature icon"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                />
              </div>
              <div>
                <Heading level={3} text={feature.title || ''} className='text-xl mb-2' />
                <div className="">
                  {feature.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </BlockBGColor>
  );
}