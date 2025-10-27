import * as React from 'react';
import { Flex } from '@sanity/ui';
import { urlForImage } from '../lib/image';

interface ILogoParadePreviewProps {
  title: string;
  images: any[];
}


const LogoParadePreview: React.FunctionComponent<ILogoParadePreviewProps> = (props) => {
  return (
    <div style={{ backgroundColor: 'white', padding: '20px' }}>
      {props.title && <h2>{props.title}</h2>}
      <Flex justify="center" align="center" gap={5}>
        {props.images?.map((image: any) => {
          return image.asset && (
            <img src={urlForImage({ source: image.asset, width: 100, height: 100 })} alt={image.alt} style={{ width: '100%', height: 'auto', maxWidth: '100px' }} />
          )
        })}
      </Flex>
    </div>
  );
};

export default LogoParadePreview;
