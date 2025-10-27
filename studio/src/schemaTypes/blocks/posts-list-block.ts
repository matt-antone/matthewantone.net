import { defineField, defineType } from "sanity";
import { blockOptions } from '../fields/block-options';
import { PiMegaphoneLight } from "react-icons/pi";
import blocksToText from "../../lib/blocksToText";

export const postsListBlock = defineType({
  name: "postsListBlock",
  title: "Posts List",
  type: "object",
  description: 'Add a Posts List',
  icon: PiMegaphoneLight,
  fields: [
    defineField({
      name: "postType",
      title: "Post Type",
      type: "string",
      description: "The type of posts to display",
      options: {
        list: [
          { title: "Posts", value: "posts" },
          { title: "Pages", value: "pages" },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: "posts",
    }),
    defineField({
      name: "limit",
      title: "Limit",
      type: "number",
      description: "The number of posts to display per page",
      initialValue: 10,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "string",
      description: "The order of the posts to display",
      options: {
        list: [
          { title: "Newest First", value: "newest" },
          { title: "Oldest First", value: "oldest" },
        ],
      },
      initialValue: "newest",
    }),
    defineField({
      name: "showPagination",
      title: "Show Pagination",
      type: "boolean",
      description: "Whether to show pagination",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "postType",
    },
    prepare({ title }) {
      return {
        title,
        subtitle: "Posts List",
      };
    },
  },
});
