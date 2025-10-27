import { defineField, defineType } from 'sanity'
import { LinkIcon, DocumentIcon, ChevronDownIcon } from '@sanity/icons'

/**
 * Link schema object. This link object lets the user first select the type of link and then
 * then enter the URL, page reference, or post reference - depending on the type selected.
 * Learn more: https://www.sanity.io/docs/object-type
 */

export const navItem = defineType({
  name: 'navItem',
  title: 'Nav Item',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      initialValue: 'url',
      options: {
        list: [
          { title: 'URL', value: 'href' },
          { title: 'Page', value: 'page' },
          { title: 'Dropdown', value: 'dropdown' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'dropdown',
      title: 'Dropdown',
      type: "object",
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'items',
          title: 'Items',
          type: 'array',
          of: [{ type: 'navItem' }],
        }),
      ],
      hidden: ({ parent }) => parent?.linkType !== 'dropdown',
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      hidden: ({ parent }) => parent?.linkType !== 'href',
      validation: (Rule) =>
        // Custom validation to ensure URL is provided if the link type is 'href'
        Rule.custom((value, context: any) => {
          if (context.parent?.linkType === 'href' && !value) {
            return 'URL is required when Link Type is URL'
          }
          return true
        }),
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: [{ type: 'page' }],
      hidden: ({ parent }) => parent?.linkType !== 'page',
      validation: (Rule) =>
        // Custom validation to ensure page reference is provided if the link type is 'page'
        Rule.custom((value, context: any) => {
          if (context.parent?.linkType === 'page' && !value) {
            return 'Page reference is required when Link Type is Page'
          }
          return true
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => ['href', 'page'].includes(parent?.linkType),
    }),
  ],
  preview: {
    select: {
      title: 'page.name',
      subtitle: 'page.slug.current',
      linkType: 'linkType',
      page: "page",
      href: "href",
      dropdown: "dropdown",
    },
    prepare(selection) {
      const { title, subtitle, linkType, page, href, dropdown } = selection
      let prepared = null;

      switch (linkType) {
        case 'href':
          prepared = {
            title: title || dropdown?.label,
            subtitle: `Link to /${href}`,
            media: LinkIcon,
          }
          break;
        case 'dropdown':
          prepared = {
            title: dropdown?.label,
            subtitle: `Dropdown`,
            media: ChevronDownIcon,
          }
          break;
        case 'page':
        default:
          prepared = {
            title: page?.name,
            subtitle: `Link to /${page?.slug?.current}`,
            media: DocumentIcon,
          }
      }

      return prepared;
    },
  },
})
