import { defineField, defineType } from "sanity";
import { blockOptions } from "../fields/block-options";
import { PiImages } from "react-icons/pi";
import { heading } from "../fields/heading";

export const imageGridBlock = defineType({
  name: "imageGridBlock",
  title: "Image Grid",
  type: "object",
  description: 'Add a block of images to your page.',
  icon: PiImages,
  fields: [
    heading,
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({
            name: "customImage",
            title: "Image",
            type: "customImage",
            validation: (Rule) => Rule.required(),
          }),
        ],
        preview: {
          select: {
            image: "customImage.image",
            altText: "customImage.altText",
          },
          prepare({ image, altText }) {
            return {
              title: altText || "Add alternative text.",
              subtitle: "Image",
              media: image,
            };
          },
        },
      }],
    }),
    {
      ...blockOptions,
      fields: [...blockOptions.fields, {
        name: "columns",
        title: "Columns",
        type: "number",
        initialValue: 2,
      }],
    },
  ],
  preview: {
    select: {
      title: "heading.text",
      images: "images",
    },
    prepare({ title, images }) {
      return {
        title: title,
        images,
        subtitle: "Image Grid",
      };
    },
  },
});
