import { defineField, defineType } from "sanity";
import { IoImagesOutline } from "react-icons/io5";
import { blockOptions } from "../fields/block-options";
import { blocksToText } from "../../lib/blocksToText";
import { heading } from "../fields/heading";

export const carouselBlock = defineType({
  name: "carouselBlock",
  title: "Carousel",
  type: "object",
  icon: IoImagesOutline,
  description: 'Add a collection of images with text that display as a carousel',
  fields: [
    heading,
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              type: "customImage",
              name: "image",
              title: "Image",
              options: {
                hotspot: true,
              },
            },
            {
              type: "blockContent",
              name: "body",
              title: "Body",
              description: "Formatted text that appears in the carousel",
            },
          ],
          preview: {
            select: {
              title: "body",
              media: "image",
            },
            prepare({ title, media }) {
              return {
                title: blocksToText(title),
                subtitle: `Slide`,
                media: media.image,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "autoplay",
      title: "Auto-play slideshow",
      type: "boolean",
      description: "Automatically advance through slides",
      initialValue: true,
    }),
    blockOptions,
  ],
  preview: {
    select: {
      title: "heading.text",
      images: "images",
    },
    prepare({ title, images }) {
      return {
        title: title || 'Slideshow',
        subtitle: `Carousel - ${images.length === 1 ? '1 image' : `${images.length} images`}`,
        images: images,
      };
    },
  },
});