import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { rssSchema } from "@astrojs/rss";


const portfolio = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/data/portfolio" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    image: image(),
    imageAlt: z.string().optional(),
    description: z.string(),
    github: z.string(),
    link: z.string(),
    }),
  });

export const collections = { portfolio };