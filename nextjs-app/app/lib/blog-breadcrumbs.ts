import { SanityDocument } from "next-sanity";
import { BreadcrumbItem } from "../components/Breadcrumbs";

export function generateBlogBreadcrumbs(
  post: SanityDocument,
  category?: SanityDocument
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Blog",
      href: "/blog",
    },
  ];

  // Add category if it exists
  if (category) {
    items.push({
      title: category.title,
      href: `/blog/category/${category.slug}`,
    });
  }

  // Add current post
  items.push({
    title: post.title,
    href: `/blog/${post.slug}`,
    isCurrentPage: true,
  });

  return items;
} 