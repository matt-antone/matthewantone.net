import { defineQuery } from "next-sanity";
import { pageBuilder } from "./common";
import { groq } from "next-sanity";

const homeGallery = groq`
{  gallery[]{
    ...,
    asset->
  }}
`;

const defaultOGImage = groq`
  {
  "defaultOGImage": *[_type == "settings"][0].ogImage{
    ...,
    asset->,
  }
}
`;

export const getHomeQuery = groq`
  *[_type == 'home'][0]{
    _id,
    _type,
    "link": "/",
    gallery[]{
      ...,
      asset->
    },
    "defaultOGImage": *[_type == "settings"][0].ogImage{
      ...,
      asset->,
    },
    ${pageBuilder}
  }
`;