import { defineField } from "sanity";

export const blockOptions = defineField({
  name: "options",
  title: "Options",
  type: "object",
  initialValue: {
    vAlign: "center",
    style: "DEFAULT",
    textAlign: "left",
    blockTheme: "DEFAULT",
    bgFullWidth: false,
  },
  fields: [
    {
      name: "id",
      title: "ID",
      type: "string",
      description: "Unique identifier for the block. Leave blank to auto-generate.",
    },
    {
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: ["DEFAULT", "HOME", "FEATURES"],
      },
      initialValue: "DEFAULT",
      description: "Which global styles to apply.",
    },
    {
      name: "textAlign",
      title: "Text Alignment",
      type: "string",
      options: {
        list: ["left", "center", "right"],
      },
      initialValue: "left",
    },
    {
      name: "vAlign",
      title: "Vertical Alignment",
      type: "string",
      options: {
        list: ["top", "center", "bottom"],
      },
      initialValue: "center",
    },
    {
      name: "blockTheme",
      title: "Background Color",
      type: "string",
      options: {
        list: ["DEFAULT", "PRIMARY", "SECONDARY", "MUTED", "ACCENT"],
      },
      initialValue: "DEFAULT",
    },
    {
      name: "bgFullWidth",
      title: "Full Width Background",
      type: "boolean",
      initialValue: false,
    },
  ],
  options: {
    columns: 2,
  },
});
