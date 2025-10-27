import * as React from 'react';
import { toHTML } from '@portabletext/to-html';

interface IHeroPreviewProps {
  valueProposition: any;
  image: any;
  media: string;
  content: any[];
}

const HeroPreview: React.FunctionComponent<IHeroPreviewProps> = (props) => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      paddingTop: '52.6%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `url(${props.media})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backgroundBlendMode: 'multiply',
      color: 'white',
    }}>
      <div style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 'calc(100% - 2rem)',
        color: 'white',
        padding: '1rem',
        marginRight: '1rem'
      }}
        dangerouslySetInnerHTML={{ __html: toHTML(props.content) }}
      >
      </div>
    </div>
  );
};

export default HeroPreview;
