import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { generateBreadcrumbSchema } from "@/app/lib/structured-data";
import Script from "next/script";

export interface BreadcrumbItem {
  title: string;
  href: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbProps) {
  const schema = generateBreadcrumbSchema(
    items.map(item => ({
      name: item.title,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}${item.href}`
    }))
  );

  return (
    <div className="">
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="py-4 text-inherit">
        <ol className="flex items-center gap-2 text-sm">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 mx-2" aria-hidden="true" />
              )}
              {item.isCurrentPage ? (
                <span>
                  {item.title}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className=""
                >
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
} 