import { defineField, defineType } from "sanity";
import { IoImagesOutline } from "react-icons/io5";
import { GalleryPreview } from "../../components/gallery-preview";
import { blockOptions } from "../fields/block-options";
import { heading } from "../fields/heading";

export const galleryBlock = defineType({
  name: "galleryBlock",
  title: "Gallery Block",
  type: "object",
  icon: IoImagesOutline,
  description: 'Add a collection of images with text that display as a carousel',
  fields: [
    heading,
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      hidden: ({ parent }) => parent.usePageGallery,
      options: {
        sortable: true,
        layout: "grid",
      },
      of: [{ type: "customImage" }],
    }),
    {
      ...blockOptions,
      fields: [...blockOptions.fields, {
        name: "width",
        title: "Width",
        type: "string",
        initialValue: "full",
        options: {
          list: [
            { title: "Full", value: "full" },
            { title: "Limited", value: "limited" },
          ],
        },
      }]
    },
  ],
  preview: {
    select: {
      title: "heading.text",
      images: "images",
      pageGallery: "^",
      usePageGallery: "usePageGallery",
    },

    prepare(props) {
      const { title, images, pageGallery, usePageGallery } = props;
      const imageArray: string[] = []
      Object.keys(images).forEach((key) => {
        if (images[key]) {
          imageArray.push(images[key])
        }
      })
      return {
        title: title || 'Slideshow',
        subtitle: `Gallery Block - ${imageArray.length === 1 ? '1 image' : `${imageArray.length} images`}`,
        images: imageArray,
        otherImages: images,
        usePageGallery: usePageGallery,
      };
    },
  },
});