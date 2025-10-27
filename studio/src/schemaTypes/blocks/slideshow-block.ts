import { defineField, defineType } from "sanity";
import { IoImagesOutline } from "react-icons/io5";
import { blockOptions } from "../fields/block-options";
import { heading } from "../fields/heading";

export const slideshowBlock = defineType({
  name: "slideshowBlock",
  title: "Slideshow",
  type: "object",
  icon: IoImagesOutline,
  description: 'Add a collection of images that display as a slideshow',
  fields: [
    heading,
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "customImage",
        }
      ],
      validation: (Rule) => Rule.required().min(1).max(6),
    }),

    {
      ...blockOptions, fields: [
        ...blockOptions.fields,
        defineField({
          name: "autoplay",
          title: "Auto-play slideshow",
          type: "boolean",
          description: "Automatically advance through slides",
          initialValue: true,
        }),
        defineField({
          name: "interval",
          title: "Slide interval",
          type: "number",
          description: "Time in seconds between slide transitions",
          initialValue: 5,
          validation: (Rule) => Rule.min(1).max(15),
          hidden: ({ document }) => !document?.autoplay,
        }),
      ]
    }
  ],
  preview: {
    select: {
      title: "heading.text",
      images: "images",
      image0: "images.0.asset.url",
      image1: "images.1.asset.url",
      image2: "images.2.asset.url",
      image3: "images.3.asset.url",
      image4: "images.4.asset.url",
      image5: "images.5.asset.url",
      image6: "images.6.asset.url",
    },
    prepare({ title, images }) {
      const imageArray: string[] = []
      Object.keys(images).forEach((key) => {
        if (images[key]) {
          imageArray.push(images[key])
        }
      })
      return {
        title: title || 'Slideshow',
        subtitle: imageArray.length === 1 ? '1 image' : `${imageArray.length} images`,
        images: imageArray,
      };
    },
  },
});