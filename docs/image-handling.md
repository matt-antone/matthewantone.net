# Image Handling Guide

This guide details how images, particularly those sourced from Sanity CMS, are handled and optimized within the Next.js application.

## Core Components & Utilities

The primary mechanisms for image handling are:

1.  **`OptimizedImage.tsx`**: A centralized React component responsible for rendering images.

    - Location: `nextjs-app/app/components/ui/optimized-image.tsx`
    - Purpose: Wraps `next/image` to provide a consistent way to display Sanity images with built-in optimization and correct URL generation.
    - Client Component: Must include `"use client";` at the top as it utilizes React hooks.

2.  **`urlForImage` Utility**: A helper function for generating image URLs from Sanity image assets.
    - Location: `nextjs-app/sanity/lib/image.ts`
    - Purpose: Constructs the appropriate Sanity CDN URL for an image, allowing for transformations (resizing, cropping, quality adjustments) if needed.
    - Client-Safe: This utility is designed to be safe for use in client components. It uses only the public `projectId` and `dataset` (sourced from environment variables via `nextjs-app/sanity/lib/api.ts`) and does _not_ import or use the main tokenized Sanity client (`nextjs-app/sanity/lib/client.ts`).

## `OptimizedImage.tsx` Props and Behavior

The `OptimizedImage.tsx` component accepts the following props to control image rendering:

- **`image`** (required): The Sanity image asset object (e.g., `{ _type: 'image', asset: { _ref: 'image-...' } }`).
- **`alt`** (required): The alternative text for the image, for accessibility.
- **`width`** (optional): The intrinsic width of the image.
  - If `fill` is `false` (or not set), this defines the rendered width.
  - Passed to `urlForImage` to request a specific width from Sanity.
- **`height`** (optional): The intrinsic height of the image.
  - If `fill` is `false` (or not set), this defines the rendered height.
  - Passed to `urlForImage` to request a specific height from Sanity.
- **`fill`** (optional, boolean):
  - If `true`, the image will fill its parent container. The parent container _must_ have `position: relative` and defined dimensions.
  - If `fill={true}` and `width`/`height` are also provided to `OptimizedImage`, these dimensions are passed to `urlForImage` to request a specifically sized version from Sanity. `next/image` then fills its container based on this source image.
  - If `fill={true}` and `width`/`height` are _not_ provided to `OptimizedImage`, `urlForImage` is called _without_ specific dimensions (allowing Sanity to return the natural image). `next/image` (which requires the `sizes` prop in this scenario) handles responsive scaling.
- **`objectFit`** (optional, string): Controls the CSS `object-fit` property (e.g., `"cover"`, `"contain"`). Primarily used when `fill={true}` to determine how the image should fit within its container.
- **`priority`** (optional, boolean): Passed directly to `next/image`. Set to `true` for images critical to the Largest Contentful Paint (LCP).
- **`loading`** (optional, string): Passed directly to `next/image` (e.g., `"lazy"`, `"eager"`). Defaults to `"lazy"`.
- **`sizes`** (optional, string): Passed directly to `next/image`. Crucial for responsive images, especially when `fill={true}` or when using images with fixed aspect ratios at different viewport sizes. See `next/image` documentation for details.
- **`className`** (optional, string): Applied to the wrapper `div` that `OptimizedImage` renders around the `next/image` component.

## Usage Examples

### Basic Image with Fixed Dimensions

```tsx
import { OptimizedImage } from "@/app/components/ui/optimized-image";

// Assuming 'sanityImage' is an image object fetched from Sanity
<OptimizedImage
  image={sanityImage}
  alt="A descriptive alt text"
  width={300}
  height={200}
/>;
```

### Image Filling a Container (Cover)

The parent `div` needs `position: relative` and dimensions.

```tsx
import { OptimizedImage } from "@/app/components/ui/optimized-image";

<div style={{ position: "relative", width: "100%", height: "400px" }}>
  <OptimizedImage
    image={sanityImage}
    alt="A descriptive alt text"
    fill
    objectFit="cover"
    sizes="(max-width: 768px) 100vw, 50vw" // Example sizes prop
  />
</div>;
```

### Image Filling a Container (Contain)

```tsx
import { OptimizedImage } from "@/app/components/ui/optimized-image";

<div style={{ position: "relative", width: "150px", height: "150px" }}>
  <OptimizedImage
    image={sanityLogo}
    alt="Company Logo"
    fill
    objectFit="contain"
    sizes="150px" // Example sizes prop
  />
</div>;
```

## Best Practices

- **Always provide `alt` text** for accessibility.
- Use the `priority` prop for LCP images.
- When using `fill={true}`, ensure the parent container has relative positioning and dimensions.
- Provide an appropriate `sizes` prop when using `fill={true}` or for responsive fixed-size images to ensure optimal image loading.
- Leverage the `objectFit` prop with `fill={true}` to control how the image scales within its bounds.
