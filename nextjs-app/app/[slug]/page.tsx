import type { Metadata } from "next";
import Head from "next/head";
import Image from "next/image";
import PageBuilderPage from "@/app/components/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { getPageQuery, pagesSlugs } from "@/sanity/lib/queries";
import { GetPageQueryResult, SanityImageAsset } from "@/types/sanity.types";
import { notFound } from "next/navigation";
import { urlForImage } from "@/sanity/lib/image";
import { Content } from "@/app/components/Content";
import { toPlainText } from "@portabletext/react";
import Script from "next/script";
import { generateWebPageSchema } from "@/app/lib/structured-data";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { generateBreadcrumbs } from "@/app/lib/breadcrumbs";
import { cn } from "@/app/lib/utils";
import { PageHeader } from "../components/PageHeader";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const result = await sanityFetch<typeof getPageQuery>({
    query: getPageQuery,
    params: params,
    tags: [params.slug],
  });

  const page = result.data;

  if (!page?._id) {
    return notFound();
  }

  const url = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/${params.slug}`
    : `https://your-domain.com/${params.slug}`;

  const breadcrumbs = generateBreadcrumbs(page, page.parentPages || []);

  const heroImage = page?.hero?.asset?.url ? urlForImage({ source: page.hero }) : null;
  const heroAlt = page?.hero?.alt || page?.title || "Hero image";

  return (
    <div className="">
      <Head>
        <title>{page?.title}</title>
      </Head>
      <Content>
        <PageHeader
          heading={page.heading || page.title}
          subheading={page.subheading}
          className="relative z-10"
          breadcrumbs={breadcrumbs}
          showHero={page?.showHero}
          heroImage={heroImage || undefined}
          heroAlt={heroAlt || undefined}
        />
        {page && <PageBuilderPage page={page as GetPageQueryResult} />}
        <Script
          id="page-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateWebPageSchema({
                title: page?.title || "",
                description: page?.description ? toPlainText(page?.description) : page?.heading || "",
                url: url,
              })
            ),
          }}
        />
      </Content>
    </div >
  );
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: pagesSlugs,
    // // Use the published perspective in generateStaticParams
    perspective: "published",
    stega: false,
  });
  return data.filter((page: any) => {
    return !["blog"].includes(page.slug);
  });
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { data: page } = await sanityFetch({
    query: getPageQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  });

  const url = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/${params.slug}`
    : `https://your-domain.com/${params.slug}`;

  const images = [];

  if (page?.defaultOGImage) {
    const ogImageUrl = urlForImage({ source: page.defaultOGImage, width: 1200, height: 630 });
    if (ogImageUrl) {
      images.push({ url: ogImageUrl });
    }
  }

  if (page?.gallery?.length) {
    page.gallery.forEach((galleryItem: any) => {
      if (galleryItem?.image?.asset) {
        const galleryImageUrl = urlForImage({ source: galleryItem.image, width: 1200, height: 630 });
        if (galleryImageUrl) {
          images.push({ url: galleryImageUrl });
        }
      }
    });
  }
  return {
    title: page?.title,
    description: page?.description ? toPlainText(page?.description) : page?.heading || "",
    openGraph: {
      type: 'article',
      url: url,
      images,
    },
    alternates: {
      canonical: url,
    },
    other: {
      'og:type': 'article',
    },
  } satisfies Metadata;
}