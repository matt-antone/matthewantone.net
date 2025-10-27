import { person } from './documents/person'
import { page } from './documents/page'
import { post } from './documents/post'
import { settings } from './singletons/settings'
import { link } from './objects/link'
import { blockContent } from './objects/blockContent'
import { customImage } from './objects/customImage'
import { navItem } from './objects/nav-item'
import { home } from './singletons/home'
import * as blocks from './blocks'
import * as objects from './objects'
import deletedDocBinDocument from './singletons/deletedDocBinDocument'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  home,
  // Documents
  page,
  person,
  post,
  // Objects
  // blockContent,
  // customImage,
  // link,
  // navItem,
  ...Object.values(objects),
  ...Object.values(blocks),
  deletedDocBinDocument,
]
