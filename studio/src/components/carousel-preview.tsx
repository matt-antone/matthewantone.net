"use client";
import * as React from 'react';
import { Box, Card, Flex, Text } from "@sanity/ui";
import { urlForImage } from '../lib/image';
import TextPreview from './text-preview';

interface ICarouselPreviewProps {
  title: string;
  subtitle: string;
  images: any[];
}

const CarouselPreview: React.FunctionComponent<ICarouselPreviewProps> = (props) => {
  const { title, subtitle, images = [] } = props;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  // Auto-advance slides every 3 seconds
  React.useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <Box padding={2}>
        <Text>Carousel: {title || 'Untitled'}</Text>
        <Card tone="caution" padding={4} marginTop={3}>
          <Text>No slides added to this carousel</Text>
        </Card>
      </Box>
    );
  }

  return (
    <Box key={`${title}-${subtitle}`} padding={2}>
      <Flex paddingBottom={2} gap={2} direction="column">
        <Text size={2} weight="semibold">Carousel: {title || 'Untitled'}</Text>
        <Text size={1} muted>{subtitle || `${images.length} images`}</Text>
      </Flex>
      <Card padding={0} radius={2} overflow="hidden" style={{ position: 'relative', aspectRatio: '16/9' }}>
        {images.map((slide: any, idx: number) => {
          const imageUrl = slide.image ? urlForImage({ source: slide.image.image, width: 640, height: 480 }) : '';
          // return <p>Image</p>
          return (
            <Flex
              key={`${idx}-${slide}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: idx === currentIndex ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out',
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              padding={2}
              gap={4}
              direction="column"
              justify="flex-end"
            >
              <Box style={{ color: 'white', marginBottom: 40 }}>

                {slide.body && <TextPreview content={slide.body} />}
              </Box>
            </Flex>
          )
        })}
        <Flex
          justify="space-between"
          padding={2}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(0,0,0,0.5)'
          }}
        >
          <Text size={1} style={{ color: 'white' }}>Image {currentIndex + 1} of {images.length}</Text>
        </Flex>
      </Card>
    </Box>
  );
};

export default CarouselPreview;
