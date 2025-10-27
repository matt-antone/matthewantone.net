import * as React from 'react';
import { urlForImage } from '../lib/image';

interface IImagePreviewProps {
  value: any;
}

const ImagePreview: React.FunctionComponent<IImagePreviewProps> = ({ value }) => {
  if (!value?.asset) return <p>No image data</p>;
  const imageUrl = value?.asset ? urlForImage({ source: value.asset, width: 640, height: 480 }) : null;
  return imageUrl ? <img src={imageUrl} alt={value.alt} style={{ width: '100%', height: 'auto' }} /> : null;
};

export default ImagePreview;
