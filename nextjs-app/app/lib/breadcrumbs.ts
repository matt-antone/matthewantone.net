import { SanityDocument } from "next-sanity";
import { BreadcrumbItem } from "../components/Breadcrumbs";

export function generateBreadcrumbs(
  currentPage: SanityDocument,
  parentPages: SanityDocument[] = []
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    {
      title: "Home",
      href: "/",
    },
  ];

  // Add parent pages
  parentPages.forEach((page) => {
    items.push({
      title: page.title,
      href: `/${page.slug}`,
    });
  });

  // Add current page
  items.push({
    title: currentPage.title,
    href: `/${currentPage.slug}`,
    isCurrentPage: true,
  });

  return items;
} 