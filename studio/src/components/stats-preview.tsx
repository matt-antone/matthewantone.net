import * as React from 'react';
import { Flex, Text } from '@sanity/ui';
interface IStatsPreviewProps {
  stats: any;
  title: string;
}

const StatsPreview: React.FunctionComponent<IStatsPreviewProps> = (props) => {
  return (
    <div style={{ width: '100%' }}>
      {props.title && <h2>{props.title || "Untitled"}</h2>}
      <Flex gap={4} align="center" justify="space-between" style={{ width: '100%' }}>
        {props.stats?.map((stat: any) => (
          <Flex
            padding={2}
            direction="column-reverse"
            align="center"
            justify="space-between"
            reversed={false}
            gap={1}
            key={stat._key}
            style={{ width: '100%', backgroundColor: 'silver', borderRadius: 10 }}
          >
            <Text size={1}>{stat.title}</Text>
            <Text size={4}>{stat.value}</Text>
          </Flex>
        ))}
      </Flex>
    </div>
  );
};

export default StatsPreview;
