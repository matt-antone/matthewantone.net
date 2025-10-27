"use client";

/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import {
  PortableText as NextSanityPortableText,
  type PortableTextBlock,
  type PortableTextComponents as NextSanityPortableTextComponentsType,
  type PortableTextComponentProps as NextSanityPortableTextComponentProps,
  type PortableTextMarkComponentProps,
} from "next-sanity";

// We might not need PortableTextReactComponents if we align fully with next-sanity types
// import type { PortableTextReactComponents } from "@portabletext/react";

import ResolvedLink from "@/app/components/ResolvedLink";

// Import the block components from the central index file
import { components as blockContentTypeComponents } from "@/app/components/blocks";

interface CustomPortableTextProps {
  className?: string;
  value: PortableTextBlock[];
}

// Define local components to be directly compatible with next-sanity's types
const localBlockComponents: NextSanityPortableTextComponentsType['block'] = {
  // Cast individual renderers if their props don't directly match
  // For h1, h2, etc., PortableTextComponentProps<PortableTextBlock> is likely the expected type
  h1: ({ children, value }: NextSanityPortableTextComponentProps<PortableTextBlock>) => (
    <h1 className="group relative" id={value?._key}>
      {children}
      <a
        href={`#${value?._key}`}
        className="absolute left-0 top-0 bottom-0 -ml-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
      </a>
    </h1>
  ),
  h2: ({ children, value }: NextSanityPortableTextComponentProps<PortableTextBlock>) => (
    <h2 className="group relative" id={value?._key}>
      {children}
      <a
        href={`#${value?._key}`}
        className="absolute left-0 top-0 bottom-0 -ml-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
      </a>
    </h2>
  ),
  normal: ({ children }: NextSanityPortableTextComponentProps<PortableTextBlock>) => <p>{children}</p>,
  blockquote: ({ children }: NextSanityPortableTextComponentProps<PortableTextBlock>) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic">{children}</blockquote>
  ),
};

const localMarkComponents: NextSanityPortableTextComponentsType['marks'] = {
  // For 'link', the value prop of PortableTextComponentProps is the mark definition
  link: ({ children, value }: PortableTextMarkComponentProps<any>) => { // Use PortableTextMarkComponentProps
    const linkValue = value && typeof value === 'object' && 'href' in value ? value : undefined;
    return <ResolvedLink link={linkValue as { href?: string }}>{children}</ResolvedLink>;
  },
};

export default function CustomPortableText({
  className,
  value,
}: CustomPortableTextProps) {

  const allComponents: NextSanityPortableTextComponentsType = {
    types: {
      ...(blockContentTypeComponents.types || {}),
    },
    block: localBlockComponents,
    marks: localMarkComponents,
    // Provide default empty objects for list and listItem if not customized
    list: {},
    listItem: {},
    // Ensure all keys from NextSanityPortableTextComponentsType are covered if necessary
    // or rely on default merging behavior of NextSanityPortableText
  };

  return (
    <div
      className={["prose dark:prose-invert prose-a:text-red-500", className]
        .filter(Boolean)
        .join(" ")}
    >
      <NextSanityPortableText components={allComponents} value={value} />
    </div>
  );
}
