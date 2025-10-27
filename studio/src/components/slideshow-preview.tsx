import { Box, Card, Flex, Text } from "@sanity/ui";
import React, { useState, useEffect } from "react";

export const SlideshowPreview = (value: any) => {
  const { title, subtitle, images = [] } = value;
  const [currentIndex, setCurrentIndex] = useState(0);
  // Auto-advance slides every 3 seconds
  useEffect(() => {
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
        <Text>Slideshow: {title || 'Untitled'}</Text>
        <Card tone="caution" padding={4} marginTop={3}>
          <Text>No images added to this slideshow</Text>
        </Card>
      </Box>
    );
  }

  return (
    <Box padding={2}>
      <Flex paddingBottom={2} gap={2} direction="column">
        <Text size={2} weight="semibold">Slideshow: {title || 'Untitled'}</Text>
        <Text size={1} muted>{subtitle || `${images.length} images`}</Text>
      </Flex>
      <Card padding={0} radius={2} overflow="hidden" style={{ position: 'relative', aspectRatio: '16/9' }}>
        {images.map((img: any, idx: number) => (
          <Box
            key={`${idx}-${img}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: idx === currentIndex ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
              backgroundImage: `url(${img.asset?.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
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