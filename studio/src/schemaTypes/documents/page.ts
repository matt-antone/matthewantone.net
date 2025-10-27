import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'
import * as blocks from '../blocks'
import { gallery } from '../fields/gallery'
/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The title of the page. This will be used as the title of the page in the browser and as the title of the page in the search engine results.',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'The heading of the page.',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      description: 'The subheading of the page.',
    }),
    defineField({
      name: 'showHero',
      title: 'Show Hero',
      type: 'boolean',
      description: 'Whether to show the hero section on the page.',
      initialValue: true,
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'image',
      description: 'The hero section of the page.',
      hidden: ({ parent }) => !parent?.showHero,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      description: 'The description of the page. This will be used as the description of the page in the search engine results and page lists.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (rule) => {
            // Custom validation to ensure alt text is provided if the image is present. https://www.sanity.io/docs/validation
            return rule.custom((alt, context) => {
              if ((context.document?.coverImage as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      of: [
        ...Object.keys(blocks).map((block) => ({ type: block })),
      ],
      options: {
        insertMenu: {
          // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/array-type#efb1fe03459d
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
    gallery,
  ],
})
