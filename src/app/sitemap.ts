import type { MetadataRoute } from "next";

const SITE_URL = "https://mathpro.academy";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/courses", "/combos", "/books", "/terms", "/privacy"];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
