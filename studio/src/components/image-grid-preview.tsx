import * as React from 'react';
import { Grid, Box } from '@sanity/ui';
import { urlForImage } from '../lib/image';


interface IImageGridPreviewProps {
  images: any[];
}

const ImageGridPreview: React.FunctionComponent<IImageGridPreviewProps> = (props) => {
  return (
    <div>
      <h1>Image Grid Preview</h1>
      {props.images?.length > 0 && <Grid columns={2} gap={2}>
        {props.images.map((imageRef: any) => {
          const image = urlForImage({
            source: imageRef.image,
            width: 300,
            height: 300
          });
          return (
            <Box key={imageRef._key}>
              <img src={image || ""} alt={imageRef.alt} style={{ width: "100%", height: "auto" }} />
            </Box>
          )
        })}
      </Grid>}
    </div>
  );
};

export default ImageGridPreview;
