import * as React from 'react';
import { Box, Text, Grid } from "@sanity/ui";
import { urlForImage } from '../lib/image';

export const GalleryPreview: React.FunctionComponent<any> = (props) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  return props.images?.length > 0 ? (
    <Box padding={2}>
      <Text size={1} weight="semibold">Gallery</Text>
      <h2>{props.title}</h2>
      <Box marginTop={2} marginBottom={2}>
        {
          props.images && props.images[currentIndex]?.image &&
          <img src={urlForImage({ source: props.images[currentIndex].image, width: 640, height: 480 })} alt="Gallery Image" width={640} height={480} style={{ objectFit: "cover", width: "100%", height: "auto" }} />
        }
      </Box>
      <Grid gap={2} columns={props.images?.length > 1 ? props.images.length : 1}>
        {
          props.images?.length > 1 && props.images.map(({ image }: any, index: number) => {
            return image?.asset ? (
              <img
                key={`${image?.asset?.url}-${index}`}
                onClick={() => setCurrentIndex(index)}
                src={urlForImage({ source: image, width: 640, height: 480 })}
                alt="Gallery Image" width={640} height={480}
                style={{ cursor: "pointer", objectFit: "cover", width: "100%", height: "auto", border: currentIndex === index ? "2px solid #000" : "2px solid transparent" }} />
            ) : null
          })
        }
      </Grid>
    </Box >
  ) : null;
};

export default GalleryPreview;