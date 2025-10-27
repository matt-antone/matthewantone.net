import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import type { SettingsQueryResult, NavItem as SanityNavItem } from "@/types/sanity.types";
import { cn } from "@/app/lib/utils";

// Removed local SanityFetchResponse as it was causing issues

interface FooterNavItem extends Omit<SanityNavItem, 'page' | 'post'> {
  _key: string;
  page?: { title?: string; slug?: string };
  hrefLabel?: string;
  internalName?: string;
  dropdownLabel?: string;
  title?: string;
}

const resolveLinkUrl = (link: FooterNavItem): string => {
  if (link.linkType === "page" && link.page?.slug) {
    return link.page.slug.startsWith("/") ? link.page.slug : `/${link.page.slug}`;
  }
  if (link.linkType === "href" && link.href) {
    return link.href;
  }
  return "#";
};

const getLinkText = (link: FooterNavItem): string => {
  if (link.linkType === "page" && link.page?.title) return link.page.title;
  if (link.linkType === "href" && link.hrefLabel) return link.hrefLabel;
  if (link.internalName) return link.internalName;
  if (link.dropdownLabel) return link.dropdownLabel;
  if (link.title) return link.title;
  return "More";
};

export default async function Footer() {
  // Pass the query string itself (via typeof settingsQuery) as the generic.
  // The return type should then be inferred by next-sanity/TypeGen as { data: SettingsQueryResult | null, ... }
  const result = await sanityFetch<typeof settingsQuery>({
    query: settingsQuery,
    stega: false,
  });

  // result should now be correctly typed, so result.data should be SettingsQueryResult | null
  const settings = result.data;

  if (!settings) {
    return (
      <footer className="bg-gray-100 border-gray-200 border-t mt-12">
        <div className="container mx-auto px-4 text-center responsive-py">
          <p className="text-gray-500">Footer content unavailable.</p>
        </div>
      </footer>
    );
  }

  let logoContent = null;
  let siteTitleContent = null;

  if (settings.siteLogo?.asset?.url) {
    const logoAsset = settings.siteLogo.asset;
    const logoAlt = settings.siteLogo.alt || settings.title || "Site Logo";
    let actualWidth = 100;
    let actualHeight = 40;

    if (logoAsset.metadata?.dimensions?.width && logoAsset.metadata?.dimensions?.height) {
      const aspectRatio = logoAsset.metadata.dimensions.width / logoAsset.metadata.dimensions.height;
      actualHeight = 50;
      actualWidth = Math.round(actualHeight * aspectRatio);
    }

    logoContent = (
      <Link href="/" className="flex items-center">
        <Image
          src={logoAsset.url}
          alt={logoAlt}
          width={actualWidth}
          height={actualHeight}
          priority={false}
        />
      </Link>
    );
  }

  if (settings.showTitle || !logoContent) {
    if (settings.title) {
      siteTitleContent = (
        <p className={cn("text-lg font-semibold", logoContent && "ml-3")}>
          {settings.title}
        </p>
      );
    }
  }
  ``
  const footerNavItems: FooterNavItem[] | undefined = settings.navigation?.footer as FooterNavItem[] | undefined;
  return (
    <footer className="bg-gray-100 border-gray-200 border-t mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center responsive-py">
          <div className="flex items-center justify-center md:justify-start">
            {logoContent}
            {siteTitleContent}
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:col-span-2 md:justify-end">
            {footerNavItems && footerNavItems.length > 0 && footerNavItems.map((item: FooterNavItem) => {
              if (!item?._key || !item.linkType) return null;
              const url = resolveLinkUrl(item);
              const text = getLinkText(item);
              const target = item.openInNewTab ? "_blank" : "_self";

              return (
                <Link key={item._key} href={url} target={target} rel={item.openInNewTab ? "noopener noreferrer" : undefined} className="text-gray-600 hover:text-primary transition-colors duration-200">
                  {text}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="text-center text-gray-500 text-sm py-4 border-t border-gray-200 mt-8">
          © {new Date().getFullYear()} {settings.title || "My Awesome Company"}. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
