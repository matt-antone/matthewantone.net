import Link from "next/link";
import MainNavigation from "./MainNavigation";
import { sanityFetch } from "@/sanity/lib/live";
// import { OptimizedImage } from "@/app/components/ui/optimized-image"; // This import is unused
import MobileNavigation from "./MobileNavigation";
import Image from "next/image";
export default async function Header() {
  const { data } = await sanityFetch<any>({
    query: `*[_type == "settings"][0]{
    siteLogo{
      ...,
      asset->,
      alt
    },
    showTitle,
    title
}`,
  });

  let actualWidth = 100;
  let actualHeight = 50;
  let logoLinkContent = null;

  if (data?.siteLogo?.asset) {
    const logoAsset = data.siteLogo.asset;
    const logoWidth = logoAsset.metadata?.dimensions?.width;
    const logoHeight = logoAsset.metadata?.dimensions?.height;

    if (logoWidth && logoHeight) {
      const logoAspectRatio = logoWidth / logoHeight;
      actualHeight = 75;
      actualWidth = Math.round(actualHeight * logoAspectRatio);
    } else {
      console.warn("[Header] Logo dimensions missing in metadata, using default display size.");
    }

    logoLinkContent = (
      <Link className="flex items-center gap-2" href="/">
        <Image
          src={data.siteLogo.asset.url}
          alt={data.siteLogo.alt || data.title || "Site Logo"}
          width={actualWidth}
          height={actualHeight}
          priority
        />
        {data.showTitle && <div className="text-2xl font-bold">{data.title}</div>}
      </Link>
    );
  } else {
    if (data?.title) {
      logoLinkContent = (
        <Link className="flex items-center gap-2" href="/">
          {data.showTitle && <div className="text-2xl font-bold">{data.title}</div>}
        </Link>
      );
    }
    console.warn("[Header] Site logo data is missing.");
  }

  return (
    <header className="fixed z-50 h-24 inset-0 bg-white/80 flex items-center backdrop-blur-lg">
      <div className="container py-6">
        <div className="flex items-center justify-between gap-5">
          {logoLinkContent}
          <MainNavigation />
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}

