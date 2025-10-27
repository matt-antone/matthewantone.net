import { defineField, defineType } from "sanity";
import { blockOptions } from '../fields/block-options';
import { PiMegaphoneLight } from "react-icons/pi";
import blocksToText from "../../lib/blocksToText";

export const callToActionBlock = defineType({
  name: "callToActionBlock",
  title: "Call To Action",
  type: "object",
  description: 'Add a Call To Action',
  icon: PiMegaphoneLight,
  fields: [
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      description: "The text of the call to action",
    }),
    defineField({
      name: "formDisplay",
      title: "Form Display",
      type: "string",
      options: {
        list: [
          { title: "Inline", value: "inline" },
          { title: "Modal", value: "modal" },
        ],
      },
      initialValue: "modal",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
      description: "The text of the button",
    }),
    defineField({
      ...blockOptions,
      fields: [
        ...blockOptions.fields,
        {
          name: "layout",
          title: "Layout",
          type: "string",
          initialValue: "default",
          options: {
            list: ["default", "form"],
          },
        }
      ]
    }),
  ],
  preview: {
    select: {
      body: "body",
    },
    prepare({ body }) {
      return {
        title: blocksToText(body).slice(0, 50),
        subtitle: "Call To Action",
      };
    },
  },
});
