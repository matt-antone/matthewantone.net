import { defineQuery } from "next-sanity";

export const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`;

export const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`;


export const pageBuilder = /* groq */ `
"pageBuilder": pageBuilder[]{
      ...,
      _type == 'advancedListBlock' => {
        ...,
        listItems[]{
          ...,
          image{
            ...,
            asset->
          }
        }
      },
      _type == "carouselBlock" => {
        ...,
        images[]{
          ...,
          image{
            ...,
            asset->
          }
        }
      },
      _type == "featuresBlock" => {
        ...,
        features[]{
          ...,
          icon{
            ...,
            image{
              ...,
              asset->
            }
          }
        }
      },
      _type == "heroBlock" => {
        ...,
        image{
          ...,
          asset->
        }
      },
      _type == "imageGridBlock" => {
        ...,
        images[]{
          ...,
          customImage{
            ...,
            image{
              ...,
              asset->
            }
          }
        }
      },
      _type == "testimonialBlock" => {
        ...,
        author{
          ...,
          image{
            ...,
            asset->
          }
        }
      },
      _type == "postsListBlock" => {
        ...,
        postType,
        limit,
        order,
        "posts": *[_type == "post" && defined(slug.current)][0..10]
      }
    }
`;