import { defineArrayMember, defineType, defineField } from 'sanity'
import { linkAnnotation } from './link'

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 *
 * Learn more: https://www.sanity.io/docs/block-content
 */
export const blockContentBento = defineType({
  title: 'Block Content',
  name: 'blockContentBento',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'customImage',
    }),
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        // { title: 'H1', value: 'h1' },
        // { title: 'H2', value: 'h2' },
        // { title: 'H3', value: 'h3' },
        // { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        annotations: [
          { ...linkAnnotation }
        ],
      },
    }),
  ],
})
