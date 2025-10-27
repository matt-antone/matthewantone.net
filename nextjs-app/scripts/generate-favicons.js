const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env.local") }); // Load .env.local

const fs = require("fs").promises;
const sharp = require("sharp");
const { createClient } = require("@sanity/client");
const imageUrlBuilder = require("@sanity/image-url");

// --- Sanity Client Configuration ---
// Ensure these environment variables are set in your .env file for the build process
// or configured in your Vercel/Netlify environment.
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const SANITY_API_VERSION =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-05-03"; // Use a recent API version

if (!SANITY_PROJECT_ID || !SANITY_DATASET) {
  console.error(
    "Sanity project ID or dataset not configured. Check environment variables NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET."
  );
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false, // Use false for build scripts to ensure fresh data
});

const builder = imageUrlBuilder(client);

function urlForImage(source) {
  return builder.image(source);
}
// --- End Sanity Client Configuration ---

const OUTPUT_DIR = path.join(__dirname, "..", "public", "favicons");

const FAVICON_SPECS = [
  { name: "favicon-16x16.png", width: 16, height: 16 },
  { name: "favicon-32x32.png", width: 32, height: 32 },
  {
    name: "apple-touch-icon.png",
    width: 180,
    height: 180,
    addBackground: true,
  }, // iOS might add black bg to transparent icons
  { name: "android-chrome-192x192.png", width: 192, height: 192 },
  { name: "android-chrome-512x512.png", width: 512, height: 512 },
  { name: "favicon.ico", width: 32, height: 32, isIco: true }, // Special case for .ico
];

async function fetchSiteSettings() {
  try {
    const query = `*[_type == "settings"][0]{ siteLogo, title, themeColor }`;
    const settings = await client.fetch(query);
    return settings;
  } catch (error) {
    console.error("Error fetching site settings from Sanity:", error);
    return null;
  }
}

async function generateFavicons() {
  const settings = await fetchSiteSettings();

  if (!settings || !settings.siteLogo || !settings.siteLogo.asset) {
    console.warn(
      "Site logo not found in Sanity settings. Skipping favicon generation."
    );
    return;
  }

  const logoAsset = settings.siteLogo;
  // Get a URL for the original image without transformations
  const imageUrl = urlForImage(logoAsset).url();

  if (!imageUrl) {
    console.warn(
      "Could not get image URL for site logo. Skipping favicon generation."
    );
    return;
  }

  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    const imageBuffer = Buffer.from(await response.arrayBuffer());

    for (const spec of FAVICON_SPECS) {
      const outputPath = path.join(OUTPUT_DIR, spec.name);
      let imageProcessor = sharp(imageBuffer).resize(spec.width, spec.height);

      if (spec.addBackground) {
        // Add a white background for apple-touch-icon if original is transparent
        imageProcessor = imageProcessor.flatten({
          background: { r: 255, g: 255, b: 255 },
        });
      }

      if (spec.isIco) {
        // Sharp cannot directly create .ico with multiple layers easily.
        // We'll create a 32x32 PNG and save it as .ico. Modern browsers handle this well.
        await imageProcessor.png().toFile(outputPath);
      } else {
        await imageProcessor.png().toFile(outputPath);
      }
    }

    // Create site.webmanifest
    const siteTitle = settings?.title || "Your Site Name";
    const themeColor = settings?.themeColor?.hex || "#ffffff"; // Assuming themeColor is a color picker in Sanity with a .hex value

    const manifest = {
      name: siteTitle,
      short_name: siteTitle.substring(0, 12), // Or a specific short_name field from Sanity
      icons: [
        {
          src: "/favicons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/favicons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      theme_color: themeColor,
      background_color: themeColor, // Often same as theme_color, or could be a separate Sanity field
      display: "standalone",
    };
    const manifestPath = path.join(OUTPUT_DIR, "site.webmanifest");
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    console.log("Favicon generation completed successfully!");
  } catch (error) {
    console.error("Error during favicon generation:", error);
    // It's a build script, so if it fails, we should probably exit with an error code
    process.exit(1);
  }
}

// Ensure the script can be run directly
if (require.main === module) {
  generateFavicons();
}

module.exports = generateFavicons; // Export if you want to use it elsewhere, though not strictly necessary here
