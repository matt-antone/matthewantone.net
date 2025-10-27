import { defineField, defineType } from "sanity";
import { blockOptions } from "../fields/block-options";
import { PiProjectorScreenChart } from "react-icons/pi";
import { heading } from "../fields/heading";

export const statsBlock = defineType({
  name: "statsBlock",
  title: "Stats",
  type: "object",
  description: 'Add a stats block by entering the stats.',
  icon: PiProjectorScreenChart,
  fields: [
    heading,
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [
        defineField({
          name: "stat",
          title: "Stat",
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "string",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    blockOptions,
  ],
  preview: {
    select: {
      stats: "stats",
      title: "heading.text",
    },
    prepare(select) {
      const stats = select.stats;
      const title = select.title;
      return {
        title,
        subtitle: "Stats Block",
        stats
      };
    },
  },
});
