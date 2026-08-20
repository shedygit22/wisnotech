const SITE_URL = "https://wisnotech.vercel.app";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Remove any previously injected JSON-LD so pages don't stack schemas. */
function resetJsonLd() {
  document.head.querySelectorAll('script[data-seo-jsonld]').forEach((n) => n.remove());
}

function injectJsonLd(schema: object) {
  const pre = document.createElement("script");
  pre.type = "application/ld+json";
  pre.setAttribute("data-seo-jsonld", "true");
  pre.textContent = JSON.stringify(schema);
  document.head.appendChild(pre);
}

export interface PageMeta {
  title?: string;
  description?: string;
  path: string;
  image?: string;
  type?: string;
  robots?: string;
  jsonLd?: object | object[];
}

export function applyPageMeta(meta: PageMeta) {
  const title = meta.title ?? "Wisnotech — AI, Software & Automation for Growing Businesses";
  const description =
    meta.description ??
    "Wisnotech helps businesses build AI solutions, automate workflows, develop custom software and create digital systems designed for growth.";
  const url = `${SITE_URL}${meta.path}`;
  const image = meta.image ?? `${SITE_URL}/assets/wisnotech-og.png`;

  document.title = title;
  upsertMeta("name", "description", description);
  upsertMeta("name", "robots", meta.robots ?? "index, follow, max-image-preview:large, max-snippet:-1");
  upsertCanonical(url);
  upsertMeta("property", "og:type", meta.type ?? "website");
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:image", image);
  upsertMeta("property", "og:site_name", "Wisnotech");
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", image);

  resetJsonLd();
  if (meta.jsonLd) {
    const schemas = Array.isArray(meta.jsonLd) ? meta.jsonLd : [meta.jsonLd];
    for (const s of schemas) injectJsonLd(s);
  }
}

export { SITE_URL };

/** Shared JSON-LD pieces the blog and course pages reuse. */
export function orgSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Wisnotech",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/wisnotech-favicon.png`,
    sameAs: ["https://share.google/fzDWOReUCEYSgaoeA"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+2349153541297",
      email: "wisnotech@gmail.com",
      contactType: "customer service",
      areaServed: "NG",
      availableLanguage: "English",
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  date: string;
  author?: string;
  image?: string;
  path: string;
  categories?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    image: opts.image ?? `${SITE_URL}/assets/wisnotech-og.png`,
    datePublished: opts.date,
    dateModified: opts.date,
    mainEntityOfPage: `${SITE_URL}${opts.path}`,
    author: { "@type": "Organization", name: opts.author ?? "Wisnotech", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Wisnotech", url: SITE_URL },
    inLanguage: "en",
    keywords: (opts.categories ?? []).join(", "),
  };
}

export function courseSchema(opts: {
  name: string;
  description: string;
  path: string;
  image?: string;
  duration?: string;
  priceUsd?: number;
  priceCurrency?: string;
  offers?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: opts.name,
    description: opts.description,
    isAccessibleForFree: false,
    url: `${SITE_URL}${opts.path}`,
    provider: { "@type": "Organization", name: "Wisnotech", url: SITE_URL },
    ...(opts.duration ? { timeRequired: `P${opts.duration.replace(/\s+/g, "")}` } : {}),
    ...(opts.priceUsd
      ? {
          offers: {
            "@type": "Offer",
            price: opts.priceUsd,
            priceCurrency: opts.priceCurrency ?? "USD",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}${opts.path}`,
          },
        }
      : {}),
  };
}