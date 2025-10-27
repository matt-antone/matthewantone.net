import { defineField } from 'sanity';
import { stegaClean } from "@sanity/client/stega"

export const gallery = defineField({
  name: "gallery",
  title: "Gallery",
  type: "array",
  of: [{
    type: "image",
    fields: [{ name: "altText", type: "string" }],
    preview: {
      select: {
        alt: "altText",
        image: "asset",
      },
      prepare(selection) {
        const { image, alt } = selection;
        return {
          title: alt || 'Untitled',
          media: image,
        }
      },
    },
  }],
  description: "Add images to the gallery. Important for accessibility and SEO.",
  options: {
    sortable: true,
    // layout: "grid",
  },

}); 