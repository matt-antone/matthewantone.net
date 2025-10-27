import { defineField } from "sanity";

export const heading = defineField({
  name: "heading",
  title: "Heading",
  type: "object",
  initialValue: {
    level: 2,
  },
  options: {
    columns: 2,
  },
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "string",
    }),
    defineField({
      name: "level",
      title: "Level",
      type: "number",
      initialValue: 2,
      options: {
        list: [2, 3, 4, 5],
      },
    }),
  ],
});