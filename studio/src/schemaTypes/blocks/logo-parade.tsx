import { defineField, defineType } from "sanity";
import { blockOptions } from "../fields/block-options";
import { heading } from "../fields/heading";
import { PiImages } from "react-icons/pi";

export const logoParadeBlock = defineType({
  name: "logoParadeBlock",
  title: "Logo Parade",
  type: "object",
  description: 'Add a Logo Parade by adding images.',
  icon: PiImages,
  fields: [
    heading,
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "customImage" }],
      validation: (Rule) => Rule.required(),
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
        title: title || 'No Heading',
        subtitle: `Logo Parade - ${images.length === 1 ? '1 image' : `${images.length} images`}`,
      };
    },
  },
});
