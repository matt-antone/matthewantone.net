import { defineType } from "sanity";
import CustomImagePreview from "../../components/custom-image-preview";
import { ComponentType } from "react";

export const customImage = defineType({
  name: 'customImage',
  title: 'Image',
  type: 'object',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'altText',
      title: 'Alt Text',
      type: 'string',
      description: 'The alt text for the image',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      options: {
        columns: 2,
      },
      fields: [
        {
          name: 'width',
          title: 'Width',
          type: 'number',
          description: 'Image width. Optional.',
          validation: (Rule) => {
            return Rule.custom((field, context) => {
              return true;
            });
          },
        },
        {
          name: 'height',
          title: 'Height',
          type: 'number',
          description: 'Image height. Optional.',
          validation: (Rule) => {
            return Rule.custom((field, context) => {
              return true;
            });
          },
        },
        {
          name: "circle",
          title: "Circle",
          type: "boolean",
          description: "Display as a circle",
          initialValue: false,
        },
        {
          name: "showFigure",
          title: "Show Figure",
          type: "boolean",
          description: "Display as a figure",
          initialValue: false,
        },
      ],
    },
    {
      name: "figure",
      title: "Figure",
      type: "object",
      hidden: ({ parent }) => !parent?.metadata?.showFigure,
      fields: [
        {
          name: "caption",
          title: "Caption",
          type: "blockContent",
          description: "The caption for the image",
        },
        {
          name: "photoCredit",
          title: "Photo Credit",
          type: "object",
          description: "The photo credit for the image",
          options: {
            columns: 2,
            collapsible: true,
            collapsed: false,
          },
          fields: [
            {
              name: "credit",
              title: "Credit",
              type: "string",
              description: "The credit for the image",
            },
            {
              name: "creditLink",
              title: "Credit Link",
              type: "url",
              description: "The link for the credit",
            },
          ]
        },
      ],
    },
  ],
  preview: {
    select: {
      image: 'image',
      altText: 'altText',
      width: 'metadata.width',
      height: 'metadata.height',
      circle: 'metadata.circle',
      showFigure: 'metadata.showFigure',
      caption: 'figure.caption',
      photoCredit: 'figure.photoCredit.credit',
      photoCreditLink: 'figure.photoCredit.creditLink',
    },
    prepare({ image, altText, width, height, circle, showFigure, caption, photoCredit, photoCreditLink }) {
      return {
        title: altText,
        media: image,
        image,
        altText,
        width,
        height,
        circle,
        showFigure,
        caption,
        photoCredit,
        photoCreditLink,
      }
    },
  },
})