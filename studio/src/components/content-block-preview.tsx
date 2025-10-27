import { PortableText } from '@portabletext/react';
import * as React from 'react';
import { urlForImage } from '../lib/image';

interface IContentBlockPreviewProps {
  content: any;
  align: 'start' | 'center' | 'end';
}

const ContentBlockPreview: React.FunctionComponent<IContentBlockPreviewProps> = (props) => {
  return props.content ? (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: props.align === 'start' ? 'start' : props.align === 'center' ? 'center' : 'end',
      textAlign: props.align === 'start' ? 'left' : props.align === 'center' ? 'center' : 'right'
    }}>
      <PortableText value={props.content} components={{
        types: {
          image: ({ value }) => {
            const imageUrl = urlForImage({ source: value.asset, width: 640, height: 480 });
            return <img src={imageUrl} alt={value.alt} style={{ width: '100%', height: 'auto' }} />
          }
        }
      }} />
    </div>
  ) : (
    <div>
      <p>Content Block Preview</p>
    </div>
  );
};

export default ContentBlockPreview;
