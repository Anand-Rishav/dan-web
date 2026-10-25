import type { MetadataRoute } from "next";

const siteUrl = "https://danservices.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/services", "/case-studies", "/roi-calculator", "/talent-roster", "/privacy", "/terms", "/ftc-disclosure"];
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
