import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0] {
    title,
    showTitle,
    siteLogo {
      alt, // Assuming 'alt' is a field on the siteLogo image object in Sanity
      asset-> {
        url,
        metadata { dimensions }
      }
    },
    navigation {
      footer[] {
        _key,
        linkType,
        href, // For external links
        hrefLabel, // Label for external links
        openInNewTab,
        internalName, // General purpose label for internal links
        page-> {
          title,
          "slug": slug.current
        },
        dropdownLabel // If a footer link item could be a dropdown (less common for footers)
      }
    }
  }
`); 