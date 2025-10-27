import React from 'react'
import { Grid, Flex, Text, Box } from '@sanity/ui'
import { v4 as uuidv4 } from 'uuid';
import { urlForImage } from '../lib/image';

interface IFeaturesPreviewProps {
  features: IFeature[];
  heading: string;
  options: any;
}

interface IFeature {
  title: string;
  description: string;
  icon: {
    image: {
      asset: { url: string }
    }
  }
}

const FeaturesPreview: React.FunctionComponent<IFeaturesPreviewProps> = (props) => {
  const { features, heading, options } = props;
  return features?.length > 0 ? (
    <Box padding={2}>
      <Text size={2} weight="semibold" align="center">{heading || "no heading"}</Text>
      <Grid columns={options?.columns || 3} gap={2} padding={2}>
        {features.map((feature) => {
          const iconUrl = feature.icon?.image ? urlForImage({ source: feature.icon.image, width: 100, height: 100 }) : null;
          return (
            <Flex key={uuidv4()} padding={2} direction="column" align="center" gap={4}>
              {iconUrl && (
                <img src={iconUrl} alt={feature.title} width={100} height={100} />
              )}
              <Text align="center" size={1} weight="semibold">{feature.title}</Text>
              <Text align="center" size={1}>{feature.description}</Text>
            </Flex>
          )
        })}
      </Grid>
    </Box>
  ) : null;
};

export default FeaturesPreview;