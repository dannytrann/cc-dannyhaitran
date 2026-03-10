import type { MetadataRoute } from "next";
import { projects } from "@/lib/constants";

const BASE_URL = "https://dannytran.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/projects`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/about`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/contact`, priority: 0.8, changeFrequency: "monthly" as const },
  ];

  const projectPages = projects.map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: new Date(p.date),
  }));

  return [...staticPages, ...projectPages];
}
