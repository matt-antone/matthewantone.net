import { defineQuery } from "next-sanity";
import { pageBuilder } from "./common";

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    title,
    slug,
    heading,
    subheading,
    showHero,
    hero{
      alt,
      asset->{
        url,
        metadata { dimensions }
      }
    },
    description,
    coverImage{
      ...,
      asset->
    },
    "link": "/" + slug.current,
    gallery[]{
      ...,
      asset->
    },
    "defaultOGImage": *[_type == "settings"][0].ogImage{
      ...,
      asset->
    },
    "parentPages": *[_type == "page" && references(^._id)]{
      _id,
      title,
      "slug": slug.current
    },
    ${pageBuilder}
  }
`);

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`); 