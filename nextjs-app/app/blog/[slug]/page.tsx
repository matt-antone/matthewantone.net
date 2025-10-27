import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { toPlainText, type PortableTextBlock } from "next-sanity";
import { Suspense } from "react";
import Script from "next/script";

import Avatar from "@/app/components/Avatar";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import CoverImage from "@/app/components/CoverImage";
import { MorePosts } from "@/app/components/Posts";
import PortableText from "@/app/components/PortableText";
import { generateBlogBreadcrumbs } from "@/app/lib/blog-breadcrumbs";
import { sanityFetch } from "@/sanity/lib/live";
import { postPagesSlugs, postQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { generateArticleSchema } from "@/app/lib/structured-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PostPage(props: Props) {
  const params = await props.params;
  const [{ data: post }] = await Promise.all([
    sanityFetch({
      query: postQuery,
      params,
      tags: [params.slug]
    }),
  ]);

  if (!post?._id) {
    return notFound();
  }

  const breadcrumbs = generateBlogBreadcrumbs(post, post.categories?.[0]);
  const url = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${params.slug}`
    : `https://your-domain.com/blog/${params.slug}`;

  return (
    <>
      <div className="">
        <div className="container my-12 lg:my-24 grid gap-12">
          <div>
            <div className="pb-6 grid gap-6 mb-6 border-b border-gray-100">
              <div className="max-w-3xl flex flex-col gap-6">
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-7xl">
                  {post.title}
                </h2>
              </div>
              <div className="container mx-auto px-4">
                <Breadcrumbs items={breadcrumbs} />
              </div>
              <div className="max-w-3xl flex gap-4 items-center">
                {post.author &&
                  post.author.firstName &&
                  post.author.lastName && (
                    <Avatar person={post.author} date={post.date} />
                  )}
              </div>
            </div>
            <article className="gap-6 grid max-w-4xl">
              <div className="">
                <CoverImage image={post.coverImage} priority />
              </div>
              {post.content?.length && (
                <PortableText
                  className="max-w-2xl"
                  value={post.content as PortableTextBlock[]}
                />
              )}
            </article>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100">
        <div className="container my-12 lg:my-24 grid gap-12">
          <aside>
            <Suspense>{await MorePosts({ skip: post._id, limit: 2 })}</Suspense>
          </aside>
        </div>
      </div>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateArticleSchema({
              title: post.title,
              description: post.description ? toPlainText(post.description) : post.heading || "",
              image: post.coverImage ? resolveOpenGraphImage(post.coverImage) : undefined,
              publishedDate: post.date,
              modifiedDate: post._updatedAt,
              author: {
                name: post.author && post.author.firstName && post.author.lastName
                  ? `${post.author.firstName} ${post.author.lastName}`
                  : "Unknown Author",
              },
              url: url,
            })
          ),
        }}
      />
    </>
  );
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: postPagesSlugs,
    // Use the published perspective in generateStaticParams
    perspective: "published",
    stega: false,
  });
  return data;
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const { data: post } = await sanityFetch({
    query: postQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.coverImage);

  const url = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${params.slug}`
    : `https://your-domain.com/blog/${params.slug}`;

  return {
    authors:
      post?.author?.firstName && post?.author?.lastName
        ? [{ name: `${post.author.firstName} ${post.author.lastName}` }]
        : [],
    title: post?.title,
    description: post?.description ? toPlainText(post?.description) : post?.heading || "",
    openGraph: {
      type: 'article',
      url: url,
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
    alternates: {
      canonical: url,
    },
    other: {
      'og:type': 'article',
      'og:url': url,
    },
  } satisfies Metadata;
}