"use client";
import * as React from 'react';
import { CustomImage as CustomImageType, BlockContent } from '@/types/sanity.types';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { components } from '.';

interface ICustomImageBlockProps {
  block: CustomImageType
}

const CustomImageBlock: React.FunctionComponent<ICustomImageBlockProps> = (props) => {
  switch (true) {
    case props.block.metadata?.circle:
      return <CircleBlock {...props.block} />;
    case props.block.metadata?.showFigure:
      return <FigureBlock {...props.block} />;
    default:
      return <ImageBlockComponent {...props.block} />;
  }
};

const CircleBlock: React.FunctionComponent<CustomImageType> = (props) => {
  const sourceImage = props.image;
  if (!sourceImage?.asset) return null;

  const width = props.metadata?.width || 400;
  const height = props.metadata?.height || 400;
  const imageUrl = urlForImage({ source: sourceImage, width, height });
  if (!imageUrl) return null;

  return (
    <div className="flex justify-center">
      <Image
        src={imageUrl}
        alt={props?.altText || 'Circular image'}
        width={width}
        height={height}
        className="rounded-full not-prose object-cover"
        loading="lazy"
        sizes="(max-width: 768px) 50vw, 400px"
        quality={80}
      />
    </div>
  );
};

const ImageBlockComponent: React.FunctionComponent<CustomImageType> = (props) => {
  const sourceImage = props.image;
  if (!sourceImage?.asset) return null;

  const width = props?.metadata?.width || 800;
  const height = props?.metadata?.height || 600;
  const imageUrl = urlForImage({ source: sourceImage, width, height });
  if (!imageUrl) return null;

  return (
    <div className="my-4">
      <Image
        src={imageUrl}
        alt={props?.altText || 'Image'}
        width={width}
        height={height}
        className="mx-auto not-prose max-w-full h-auto object-contain"
        loading="lazy"
        sizes={`(max-width: ${width}px) 100vw, ${width}px`}
        quality={80}
      />
    </div>
  );
};

const FigureBlock: React.FunctionComponent<CustomImageType> = (props) => {
  const sourceImage = props.image;
  if (!sourceImage?.asset) return null;

  const width = props?.metadata?.width || 800;
  const height = props?.metadata?.height || 600;
  const imageUrl = urlForImage({ source: sourceImage, width, height });
  if (!imageUrl) return null;

  return (
    <figure style={{ width: props.metadata?.width ? `${props.metadata.width}px` : 'auto' }} className="mx-auto my-4 not-prose max-w-full h-auto">
      <Image
        src={imageUrl}
        alt={props?.altText || 'Figure image'}
        width={width}
        height={height}
        className="not-prose max-w-full h-auto object-contain"
        loading="lazy"
        sizes={`(max-width: ${width}px) 100vw, ${width}px`}
        quality={80}
      />
      {props?.figure?.caption && <figcaption className="text-center text-sm mt-2"><PortableText value={props?.figure?.caption as BlockContent} components={components} /></figcaption>}
    </figure>
  );
};

export default CustomImageBlock;
