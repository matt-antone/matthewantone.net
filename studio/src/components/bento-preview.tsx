import React from 'react'
import { Box, Grid, } from '@sanity/ui'
import { PortableText } from '@portabletext/react';
import ImagePreview from './image-preview';
import AdvancedImagePreview from './advanced-image-preview';
import Heading from './heading';
import { ComponentType } from 'react';
import TextPreview from './text-preview';
import { v4 as uuidv4 } from 'uuid';

enum TextColor {
  'Primary' = 'oklch(0.985 0 0)',
  'Secondary' = 'oklch(0.205 0 0)',
  'Accent' = 'oklch(0.205 0 0)',
  'Background' = 'oklch(0.145 0 0)',
  'Muted' = 'oklch(0.556 0 0)'
}

enum GridCols {
  one = 1,
  two = 2,
  three = 3,
  four = 4,
}

export const BentoPreview = (props: any) => {
  const { left, right, heading, leading, options, grid } = props || {}

  return (
    <Box padding={4}>
      {heading && <Heading text={heading.text} level={heading.level} />}
      {leading && <Box><PortableText value={leading} components={{
        types: {
          image: ImagePreview,
          advancedImage: AdvancedImagePreview as ComponentType<any>
        }
      }} /></Box>}
      <Grid columns={GridCols[grid?.columns as keyof typeof GridCols]} gap={grid.options.noGap ? 0 : 4}>
        {grid?.items?.map((item: any) => {
          return (
            <div key={uuidv4()} style={{
              gridColumn: `span ${item?.colspan} / span ${item?.colspan}`,
              backgroundColor: item?.options?.bgColor.value,
              color: TextColor[item?.options?.bgColor.label as keyof typeof TextColor]
            }}>
              <TextPreview content={item?.content} />
            </div>
          )
        })}
      </Grid>
    </Box>
  )
} 