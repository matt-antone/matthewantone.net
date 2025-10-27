import * as React from 'react';
import { urlForImage } from '../lib/image';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { PortableText } from '@portabletext/react';
import { TypedObject } from '@portabletext/types';
interface ICustomImagePreviewProps {
  image: SanityImageSource;
  altText: string;
  width: number;
  height: number;
  circle: boolean;
  showFigure: boolean;
  caption: TypedObject[];
  photoCredit: string;
  photoCreditLink: string;
}

const CustomImagePreview: React.FunctionComponent<ICustomImagePreviewProps> = (props) => {
  return props.image && props.showFigure ? <FigurePreview {...props} /> : props.image ? <ImagePreview {...props} /> : <p>Add an image</p>;
};

export default CustomImagePreview;

const ImagePreview: React.FunctionComponent<ICustomImagePreviewProps> = (props) => {
  return (
    <img
      src={urlForImage({ source: props.image, width: props.width, height: props.height })}
      alt={props.altText}
      width={props.width}
      height={props.height}
      style={{
        width: props.circle ? "400px" : props.width || '100%',
        height: props.circle ? "400px" : 'auto',
        margin: '0 auto',
        borderRadius: props.circle ? '50%' : '0',
        maxWidth: '100%',
      }}
    />
  )
}

const FigurePreview: React.FunctionComponent<ICustomImagePreviewProps> = (props) => {
  return (
    <figure>
      <ImagePreview {...props} />
      {(props.caption || props.photoCredit) && <figcaption>
        {props.caption && <PortableText value={props.caption} />}
        {props.photoCredit && props.photoCreditLink && <p>{props.photoCredit} <a href={props.photoCreditLink} target="_blank" rel="noopener noreferrer">{props.photoCreditLink}</a></p>}
      </figcaption>}
    </figure>
  )
}