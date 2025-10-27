import type { Metadata } from "next";
import Head from "next/head";
import PageBuilderPage from "@/app/components/PageBuilder";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { sanityFetch } from "@/sanity/lib/live";
import { getPageQuery, pagesSlugs, postsPaginatedQuery } from "@/sanity/lib/queries";
import { GetPageQueryResult, SanityImageAsset } from "@/types/sanity.types";
import { notFound } from "next/navigation";
import { urlForImage } from "@/sanity/lib/image";
import { Content } from "@/app/components/Content";
import PostList from "@/app/components/PostList";
import { toPlainText } from "next-sanity";
import Script from "next/script";
import { generateWebPageSchema } from "@/app/lib/structured-data";
// import { defineStegaEnabled } from "@/sanity/lib/stega"; // Potentially problematic import, commenting out for now
import { draftMode } from "next/headers"; // Corrected import for draftMode

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ searchParams }: any) {
  const sParams = await searchParams;
  const perPage = 10;
  const postPage = parseInt(sParams.page as string) || 1;
  const start = (postPage - 1) * perPage;
  const end = start + perPage - 1;

  const [{ data: page }, { data: { posts, total } }] = await Promise.all([
    sanityFetch({
      query: getPageQuery,
      params: { slug: "blog" },
      tags: ["blog"],
      // stega: defineStegaEnabled(draftMode().isEnabled), // Depends on defineStegaEnabled
    }),
    sanityFetch({
      query: postsPaginatedQuery,
      params: { start, end },
      tags: ["blog", "posts"],
      // stega: defineStegaEnabled(draftMode().isEnabled), // Depends on defineStegaEnabled
    }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  if (!page?._id) {
    return notFound();
  }

  const url = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/blog`
    : 'https://your-domain.com/blog'; // Fixed template literal and default value

  // The rest of the component rendering logic was removed by the previous erroneous edit.
  // This needs to be restored or rewritten based on its original functionality.
  // For now, just returning a placeholder to make the file syntactically valid.

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Blog", href: "/blog", isCurrentPage: true }
  ];

  return (
    <div className="">
      <Head>
        <title>{page?.title}</title>
      </Head>
      <Content>
        <PageBuilderPage page={page as GetPageQueryResult} />
        <div className="container">
          <Breadcrumbs items={breadcrumbs} />
          <PostList list={posts} />
        </div>
        <Script
          id="blog-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateWebPageSchema({
                title: page?.title || "Blog",
                description: page?.description ? toPlainText(page?.description) : page?.heading || "",
                url: url,
              })
            ),
          }}
        />
      </Content>
    </div>
  );
}

// Metadata function might also need review/restoration if affected by previous edits.
// For now, ensuring the file is syntactically valid.

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { data: pageData } = await sanityFetch({
    query: getPageQuery,
    params: { slug: "blog" },
    stega: false, // Metadata should not contain stega
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  const pageUrl = `${siteUrl}/blog`;

  const images = [];
  if (pageData?.defaultOGImage) {
    const ogImageUrl = urlForImage({ source: pageData.defaultOGImage, width: 1200, height: 630 });
    if (ogImageUrl) {
      images.push({ url: ogImageUrl });
    }
  }
  if (pageData?.gallery?.length) {
    pageData.gallery.forEach((galleryItem: any) => {
      if (galleryItem?.image?.asset) {
        const galleryImageUrl = urlForImage({ source: galleryItem.image, width: 1200, height: 630 });
        if (galleryImageUrl) {
          images.push({ url: galleryImageUrl });
        }
      }
    });
  }

  const ogLogoUrl = pageData?.siteLogo ? urlForImage({ source: pageData.siteLogo, width: 512, height: 512 }) : null;

  return {
    title: pageData?.title,
    description: pageData?.description ? toPlainText(pageData.description) : pageData?.heading || "",
    openGraph: {
      type: 'website',
      url: pageUrl,
      images: images.length > 0 ? images : undefined,
      siteName: pageData?.title, // Assuming page title can serve as siteName for this page context
    },
    alternates: {
      canonical: pageUrl,
    },
    other: {
      'og:type': 'website',
      'og:url': pageUrl,
      ...(ogLogoUrl ? { 'og:logo': ogLogoUrl } : {}),
    },
  } satisfies Metadata;
}
