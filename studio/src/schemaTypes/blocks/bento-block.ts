import { defineType } from "sanity";
import { BentoPreview } from '../../components/bento-preview'
import { blockOptions } from "../fields/block-options";
import blocksToText from "../../lib/blocksToText";
import { heading } from "../fields/heading";

export const bentoBlock = defineType({
  name: "bentoBlock",
  title: "Bento",
  type: "object",
  initialValue: {
  },
  fields: [
    heading,
    {
      name: "grid",
      title: "Bento Grid",
      type: "object",
      fields: [
        {
          name: "items",
          title: "Items",
          type: "array",
          of: [{
            type: "object",
            fields: [
              {
                name: "content",
                title: "Content",
                type: "blockContentBento",
              },
              {
                name: "options",
                title: "Options",
                type: "object",
                options: {
                  collapsible: true,
                  collapsed: false,
                  columns: 2,
                },
                fields: [
                  {
                    name: "blockTheme",
                    title: "Background Color",
                    type: "string",
                    description: "The background color of the item",
                    options: {
                      list: [
                        { title: "Primary", value: "PRIMARY" },
                        { title: "Secondary", value: "SECONDARY" },
                        { title: "Accent", value: "ACCENT" },
                        { title: "Muted", value: "MUTED" },
                        { title: "Transparent", value: "TRANSPARENT" },
                      ],
                    },
                  },
                  {
                    name: "colspan",
                    title: "Bento Width",
                    type: "string",
                    description: "The number of columns to span",
                    options: {
                      list: [{ title: '1', value: "one" }, { title: '2', value: "two" }, { title: '3', value: "three" }, { title: '4', value: "four" }],
                    },
                    initialValue: 1,
                  },
                ]
              }
            ],
            preview: {
              select: {
                content: "content",
              },
              prepare({ content, bgColor }) {
                return {
                  title: blocksToText(content).slice(0, 50) + "...",
                  subtitle: "Bento Item",
                }
              }
            }
          }],
        },
        {
          name: "options",
          title: "Options",
          type: "object",
          description: "Options for the grid",
          options: {
            collapsible: true,
            collapsed: false,
            columns: 2,
          },
          fields: [
            {
              name: "columns",
              title: "Columns",
              type: "string",
              description: "The number of columns to display",
              options: {
                list: [{ title: '1', value: "one" }, { title: '2', value: "two" }, { title: '3', value: "three" }, { title: '4', value: "four" }],
              },
            },
            {
              name: "noGap",
              title: "No Gap",
              type: "boolean",
              initialValue: false,
            },
          ],
        },
      ]
    },
    {
      ...blockOptions, fields: [...blockOptions.fields, {
        name: "offset",
        title: "Offset",
        type: "boolean",
        description: "\"Left\" larger than \"Right\"",
        initialValue: false,
      },
      {
        name: "reverse",
        title: "Reverse",
        type: "boolean",
        description: "Reverse the column order",
        initialValue: false,
      },
      ]
    },

  ],
  preview: {
    select: {
      title: "heading.text",
      level: "heading.level",
      options: "options",
      leading: "leading",
      grid: "grid",
    },
    prepare({ title, level }) {
      return {
        title: title,
        subtitle: "Bento Block",
      }
    }
  },
});
