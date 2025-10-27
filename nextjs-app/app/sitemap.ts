import { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { sitemapData } from "@/sanity/lib/queries";

/**
 * This file creates a sitemap (sitemap.xml) for the application. Learn more about sitemaps in Next.js here: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 * Be sure to update the `changeFrequency` and `priority` values to match your application's content.
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Fetch all pages and posts from Sanity
  const { data: pages } = await sanityFetch({
    query: sitemapData,
    tags: ['page', 'post'],
  });

  // Create sitemap entries for static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  // Create sitemap entries for dynamic pages and posts
  const dynamicPages = pages.map((page: any) => ({
    url: `${baseUrl}/${page._type === 'post' ? 'blog/' : ''}${page.slug}`,
    lastModified: new Date(page._updatedAt),
    changeFrequency: page._type === 'post' ? 'weekly' as const : 'monthly' as const,
    priority: page._type === 'post' ? 0.7 : 0.6,
  }));

  return [...staticPages, ...dynamicPages];
}
