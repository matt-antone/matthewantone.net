import * as React from 'react';
import { urlForImage } from '../lib/image';

interface IAdvancedImagePreviewProps {
  image?: any;
  options?: any;
  value?: any;
}

const AdvancedImagePreview: React.FunctionComponent<IAdvancedImagePreviewProps> = (props) => {
  if (!props?.image && !props?.value?.image) return <p>No image data</p>;
  let imageContent = props.value?.image || props.image || null;

  let { options, value } = props;
  const optionsData = value?.options || options || null;

  const radius = optionsData?.circle ? "50%" : "0%";
  const url = imageContent !== null ? urlForImage({
    source: imageContent,
    width: optionsData?.width,
    height: optionsData?.height
  }) : null;
  return url ? (
    <img
      src={url as string}
      style={{ width: '100%', height: 'auto', borderRadius: radius }}
      width={optionsData?.width}
      height={optionsData?.height}
    />
  ) : <p>No image data</p>;
};

export default AdvancedImagePreview;
