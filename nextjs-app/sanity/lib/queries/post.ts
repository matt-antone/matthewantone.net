import { defineQuery } from "next-sanity";
import { linkReference } from "./common";

export const postFields = /* groq */ `
  _type,
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  description,
  coverImage{
    ...,
    asset->,
  },
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
  "link": "blog/" + slug.current,
  "categories": categories[]->{
    _id,
    title,
    "slug": slug.current
  }
`;

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
      ...,
      markDefs[]{
        ...,
        ${linkReference}
      }
    },
    ${postFields}
  }
`);

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`);

export const postsPaginatedQuery = defineQuery(`{
  "posts": *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [$start...$end] {
    ${postFields}
  },
  "total": count(*[_type == "post" && defined(slug.current)])
}
`);