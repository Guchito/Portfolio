import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";


const portfolio = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/data/portfolio" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    image: image(),
    imageMobile: image().optional(),
    imageAlt: z.string(),
    description: z.string(),
    github: z.string(),
    link: z.string(),
    order: z.number().optional(),
    role: z.string().optional(),
    timeframe: z.string().optional(),
    stack: z.array(z.string()).optional(),
    earlier: z.boolean().default(false),
    }),
});

const work = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/data/work" }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    description: z.string(),
    link: z.string(),
    since: z.union([z.string(), z.number()]),
    until: z.union([z.string(), z.number()]),
  }),
});

export const collections = { portfolio, work };