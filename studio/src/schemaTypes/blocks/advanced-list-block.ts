import { defineField, defineType } from "sanity";
import { blockOptions } from "../fields/block-options";
import { heading } from "../fields/heading";
import blocksToText from "../../lib/blocksToText";
import { OlistIcon } from '@sanity/icons'

export const advancedListBlock = defineType({
  name: "advancedListBlock",
  title: "Advanced List",
  type: "object",
  description: 'Add a custom bulleted list.',
  icon: OlistIcon,
  initialValue: {
    options: {
      type: "bullet",
    },
  },
  fields: [
    heading,
    defineField({
      name: "listItems",
      title: "List Items",
      type: "array",
      of: [
        defineField({
          name: "listItem",
          title: "List Item",
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "blockContent",
            }),
          ],
          preview: {
            select: {
              image: "image",
              text: "body",
            },
            prepare({ image, text }) {
              return {
                title: text ? blocksToText(text) : "Untitled",
                media: image,
              };
            },
          },
        }),
      ],
    }),
    {
      ...blockOptions, fields: [
        ...blockOptions.fields,
        {
          name: "type",
          type: "string",
          options: {
            list: [
              { title: "Bullet", value: "bullet" },
              { title: "Number", value: "number" },
            ],
          },
        },
        {
          name: "orientation",
          title: "Orientation",
          type: "string",
          options: {
            list: [
              { title: "Horizontal", value: "horizontal" },
              { title: "Vertical", value: "vertical" },
            ],
          },
          initialValue: "vertical",
        },
      ],
    }
  ],
  preview: {
    select: {
      heading: "heading",
    },
    prepare({ heading }) {
      return {
        title: heading.text,
        subtitle: "Advanced List",
      };
    },
  },
  // components: {
  //   preview: AdvanceListPreview as ComponentType<any>,
  // },
});
