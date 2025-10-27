import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from './api'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

type ImageFormat = 'webp' | 'jpg' | 'png';

export const urlForImage = ({
  source,
  width,
  height,
  quality = 80,
  format = 'auto',
  fit = 'max',
  dpr = 2,
}: {
  source: SanityImageSource,
  width?: number | null,
  height?: number | null,
  quality?: number,
  format?: 'auto' | ImageFormat | string,
  fit?: 'max' | 'min' | 'clip' | 'crop' | 'fill',
  dpr?: number,
}) => {
  if (!source) {
    console.error('[urlForImage] Source is undefined, null, or empty.', source);
    return null;
  }

  try {
    let imageBuilderInstance = builder.image(source);

    // Apply transformations only if values are provided to avoid overriding builder defaults with undefined
    if (width) imageBuilderInstance = imageBuilderInstance.width(Math.round(width));
    if (height) imageBuilderInstance = imageBuilderInstance.height(Math.round(height));
    // Quality, fit, dpr have defaults in params, so they will always be applied unless specifically overridden by user
    imageBuilderInstance = imageBuilderInstance.quality(quality);
    imageBuilderInstance = imageBuilderInstance.fit(fit);
    imageBuilderInstance = imageBuilderInstance.dpr(dpr);

    if (format === 'auto') {
      imageBuilderInstance = imageBuilderInstance.auto('format');
    } else if (format) {
      imageBuilderInstance = imageBuilderInstance.format(format as ImageFormat); // Use defined ImageFormat types
    }

    const finalUrl = imageBuilderInstance.url();
    if (!finalUrl) {
      console.warn('[urlForImage] Generated URL is null or empty. Check ProjectId/Dataset and asset validity.');
    }
    return finalUrl;
  } catch (e) {
    console.error('[urlForImage] Error generating URL:', e, "for source:", source);
    return null;
  }
}

export type ImageData = {
  data: any; // Placeholder if SanityImageAsset was commented out
  customImage: string | null;
}

export const getImageData = async (
  image: { asset: { _ref: string } },
  options: {
    width?: number | null,
    height?: number | null,
    quality?: number,
    format?: 'auto' | ImageFormat,
    fit?: 'max' | 'min' | 'clip' | 'crop' | 'fill',
    dpr?: number,
  } = {
      width: null,
      height: null,
      quality: 80,
      format: 'auto',
      fit: 'max',
      dpr: 2,
    }
): Promise<ImageData | null> => {
  console.error("[getImageData] in lib/image.ts is currently non-functional if it relied on the Sanity client previously imported here. This function needs review and potential refactoring for server-side execution.");
  return Promise.resolve(null);
}
