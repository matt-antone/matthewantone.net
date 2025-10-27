import { defineType, defineField } from "sanity";
import { blockOptions } from "../fields/block-options";
import { PiAcorn } from "react-icons/pi";
import { heading } from "../fields/heading";

export const featuresBlock = defineType({
  name: "featuresBlock",
  title: "Features",
  type: "object",
  icon: PiAcorn,
  fields: [
    heading,
    defineField(
      {
        name: "features",
        title: "Features",
        type: "array",
        options: {
          // layout: "grid",
        },
        of: [{
          type: "object",
          preview: {
            select: {
              icon: "icon.image",
              title: "title",
              description: "description",
            },
            prepare({ icon, title, description }) {
              return {
                title: title,
                subtitle: description,
                media: icon || null,
                icon: icon?.asset ? icon?.asset : null,
              };
            },
          },
          fields: [
            {
              name: "icon",
              title: "Icon",
              type: "customImage",
            },
            { name: "title", title: "Title", type: "string" },
            { name: "description", title: "Description", type: "text" },
          ],
        },
        ],

      }),
    defineField({
      ...blockOptions, fields: [...blockOptions.fields, {
        name: "columns",
        title: "Columns",
        type: "number",
        initialValue: 3,
        validation: (Rule) => Rule.min(1).max(4),
      },
      {
        name: "layout",
        title: "Layout",
        type: "string",
        initialValue: "default",
        options: {
          list: ["default", "cards"],
        },
      }
      ]
    }),
  ],
  preview: {
    select: {
      heading: "heading.text",
      features: "features",
    },
    prepare({ heading, features }) {
      const title = features.map((feature: any) => feature.title).join(", ")
      return {
        title: title,
        subtitle: "Features Block",
      }
    }
  },
});