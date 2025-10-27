import { defineType, defineField } from "sanity";
import { blockOptions } from "../fields/block-options";
import { PiTextT } from "react-icons/pi";
import { blocksToText } from "../../lib/blocksToText";
export const contentBlock = defineType({
  name: 'contentBlock',
  title: 'Content Block',
  type: 'object',
  icon: PiTextT,
  fields: [
    {
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    },
    {
      name: 'align',
      title: 'Align',
      type: 'string',
      options: { list: ['start', 'center', 'end'] },
    },
    blockOptions,
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({ content }) {
      return {
        title: blocksToText(content).slice(0, 50) + "...",
        subtitle: "Content Block",
      };
    },
  },
})