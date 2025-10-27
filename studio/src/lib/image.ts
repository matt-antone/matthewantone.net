import createImageUrlBuilder from '@sanity/image-url'
import { SanityAsset } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from './env'
import { client } from './client';

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlForImage = ({ source, width, height }: { source: SanityAsset, width?: number, height?: number }) => {
  return source?.asset ? builder.image(source)
    .width(width || 800)
    .height(height || 600)
    .fit('max')
    .auto('format')
    .quality(80)
    .dpr(2)
    .url() : null;
}

export const getImageData = async (image: { asset: { _ref: string } }, { width, height }: { width?: number, height?: number }) => {
  if (!image) return null;
  const data = await client.fetch(`*[_id == $id][0]{
    ...,
    "asset": asset->
  }`, { id: image.asset._ref })
  return { data, customImage: urlForImage({ source: data, width, height }) };
}
