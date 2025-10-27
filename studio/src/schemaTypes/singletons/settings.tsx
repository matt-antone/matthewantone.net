import { defineField, defineType, defineArrayMember } from "sanity";
import { GrSettingsOption } from "react-icons/gr";
import * as fields from "../fields";
import * as demo from '../../lib/initialValues'

const validateUrlOrPath = (url: string) => {
  if (url && url.startsWith('#')) return true;
  if (url && url.startsWith('/')) return true;
  try {
    new URL(url);
    return true;
  } catch (e) {
    return 'Must be either an absolute path (starting with "/"), an anchor link (starting with "#"), or a valid URL';
  }
};

export const settings = defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  icon: GrSettingsOption,
  description: 'Settings for the site.',
  fields: [
    defineField({
      name: 'title',
      description: 'This field is the title of your website.',
      title: 'Title',
      type: 'string',
      initialValue: demo.title,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'showTitle',
      title: 'Show Title',
      description: 'If true, the title will be shown in the header.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      description: 'Used both for the <meta> description tag for SEO, and the blog subheader.',
      title: 'Description',
      type: 'array',
      initialValue: demo.description,
      of: [
        defineArrayMember({
          type: 'block',
          options: {},
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              defineField({
                type: 'object',
                name: 'link',
                fields: [
                  {
                    type: 'string',
                    name: 'href',
                    title: 'URL',
                    validation: (rule) => rule.required(),
                  },
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        defineField({
          name: 'alt',
          description: 'Important for accessibility and SEO.',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.ogImage as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        }),
        defineField({
          name: 'metadataBase',
          type: 'url',
          description: (
            <a
              href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase"
              rel="noreferrer noopener"
              target="_blank"
            >
              More information
            </a>
          ),
        }),
      ],
    }),
    defineField({
      type: "image",
      name: "siteLogo",
      title: "Site Logo",
      description: "Your website's logo image that will be used in the header and other prominent places.",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      type: "object",
      name: "navigation",
      title: "Navigation",
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          type: "array",
          name: "desktop",
          title: "Desktop Navigation",
          options: {
            collapsible: true,
            collapsed: true,
          },
          of: [{ type: "navItem" }],
        },
        {
          type: "array",
          name: "mobile",
          title: "Mobile Navigation",
          options: {
            collapsible: true,
            collapsed: true,
          },
          of: [{ type: "navItem" }],
        },
        {
          type: "array",
          name: "footer",
          title: "Footer Navigation",
          options: {
            collapsible: true,
            collapsed: true,
          },
          of: [{ type: "navItem" }],
        },
      ],
      preview: {
        select: {
          title: "siteTitle",
        },
        prepare(selection: { title?: string }) {
          return { ...selection };
        },
      },
    }),
    {
      type: "array",
      name: "organizations",
      title: "Organizations",
      of: [
        {
          type: "object",
          name: "organization",
          title: "Organization",
          fields: [
            {
              type: "string",
              name: "label",
              title: "Label",
              description: "Used to identify this organization in sanity.",
            },
            {
              type: "string",
              name: "name",
              title: "Name",
              description: "The official name of the organization as it should appear on the website.",
            },
            fields.localBusinessType,
            {
              type: "url",
              name: "homepage",
              title: "Home Page URL",
              description: "The main website URL for this organization.",
            },
            {
              type: "object",
              name: "address",
              title: "Address",
              description: "The physical address of the organization.",
              fields: [
                {
                  type: "string",
                  name: "street1",
                  title: "Street",
                  description: "The street address of the organization.",
                },
                {
                  type: "string",
                  name: "street2",
                  title: "Apartment, suite, etc.",
                  description: "Additional address details like apartment number or suite.",
                },
                {
                  type: "string",
                  name: "city",
                  title: "City",
                  description: "The city where the organization is located.",
                },
                {
                  type: "string",
                  name: "state",
                  title: "State",
                  description: "The state or province where the organization is located.",
                },
                {
                  type: "string",
                  name: "zip",
                  title: "Zip",
                  description: "The postal or ZIP code of the organization's address.",
                },
              ],
            },
            fields.phone,
            fields.email,
            fields.gallery,
          ],
          preview: {
            select: {
              title: "label",
            },
            prepare(selection: { title?: string }) {
              return { ...selection };
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "siteLogo.asset",
    },
    prepare(selection: { title?: string, media?: string }) {
      return { title: `${selection.title} Settings` || "Settings", media: selection.media };
    },
  },
});
