import { defineField, defineType } from "sanity";
import { blockOptions } from '../fields/block-options';
import { PiMegaphoneLight } from "react-icons/pi";
import blocksToText from "../../lib/blocksToText";

export const exampleBlock = defineType({
  name: "exampleBlock",
  title: "Example Block",
  type: "object",
  description: 'Add a Example Block',
  icon: PiMegaphoneLight,
  fields: [],
  preview: {
    select: {
      body: "body",
    },
    prepare({ body }) {
      return {
        // title: "Example Block", // TODO: Add title
        subtitle: "Example Block",
      };
    },
  },
});
