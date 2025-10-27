import * as React from 'react';
import { Box, Text } from '@sanity/ui';
import { PortableText } from '@portabletext/react'
import { PortableTextBlock } from '@portabletext/types';
import { urlForImage } from '../lib/image';
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
interface IAdvanceListPreviewProps {
  listItems: {
    key: string;
    image?: SanityImageSource;
    body: PortableTextBlock[];
  }[];
  listType: string;
  options: {
    type: string;
  }
  heading: {
    text: string;
    level: number;
  }
}

const AdvanceListPreview: React.FunctionComponent<IAdvanceListPreviewProps> = (props) => {
  return props.listType === 'number' ? (
    <NumberedList listItems={props.listItems} heading={props.heading} />
  ) : (
    <Box padding={2}>
      <Box paddingBottom={2}>
        <Text size={1}>Advanced List - {props.listType}</Text>
      </Box>
      {props.heading?.text && <Text size={2}>{props.heading.text}</Text>}
      {props.listItems?.map((item) => {
        return (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {item.image && <img src={urlForImage({ source: item.image, width: 15, height: 15 })} width="15" height="15" />}
            <span><PortableText value={item.body} /></span>
          </div>
        )
      })}
    </Box>
  );
};

const NumberedList: React.FC<{
  listItems: {
    key: string;
    image?: SanityImageSource;
    body: PortableTextBlock[];
  }[];
  heading: {
    text: string;
    level: number;
  };
}> = ({ listItems, heading }) => {
  return (
    <Box padding={2}>
      <Box paddingBottom={2}>
        <Text size={1}>Advanced List - Numbered</Text>
      </Box>
      {heading?.text && <Text size={2}>{heading.text}</Text>}
      <ol>
        {listItems.map((item) => (
          <li key={item.key}>
            <span><PortableText value={item.body} /></span>
          </li>
        ))}
      </ol>
    </Box>
  )
}

export default AdvanceListPreview;
