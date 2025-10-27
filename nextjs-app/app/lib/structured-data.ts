export interface ArticleData {
  title: string;
  description: string;
  publishedDate: string;
  modifiedDate: string;
  author: {
    name: string;
    url?: string;
  };
  image?: string;
  url: string;
}

export interface WebPageData {
  title: string;
  description: string;
  url: string;
  lastModified?: string;
}

export const generateArticleSchema = (data: ArticleData) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.image,
    datePublished: data.publishedDate,
    dateModified: data.modifiedDate,
    author: {
      '@type': 'Person',
      name: data.author.name,
    },
    url: data.url,
  };
};

export const generateWebPageSchema = (data: WebPageData) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.title,
    description: data.description,
    url: data.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${data.url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
};

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}; 