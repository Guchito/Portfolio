// uno.config.ts
import { defineConfig, presetUno, presetTypography } from "unocss";
import { PRIMARY_TEXT } from "./src/lib/constants";

export default defineConfig({
  content: {
    // Only scan your source and any HTML in public
    filesystem: [
      "src/**/*.{astro,html,js,ts,jsx,tsx,vue,svelte,md,mdx}",
      "public/**/*.html",
    ],
    // Make sure UnoCSS doesn't touch heavy folders
    pipeline: {
      include: [
        "src/**/*",
        "public/**/*.html",
      ],
      exclude: [
        "node_modules/**/*",
        ".git/**/*",
        "dist/**/*",
        ".astro/**/*",
        ".netlify/**/*",
        "coverage/**/*",
        "build/**/*",
      ],
    },
  },
  theme: {
    boxShadow: {
      custom: `2px 2px 0`,
      "custom-hover": `1px 1px 0`,
    },
    fontFamily: {
      sans: ["CabinetGrotesk", "Satoshi"],
    },
    gridTemplateRows: {
      "auto-250": "repeat(auto-fill, 250px)",
    },
    gridTemplateColumns: {
      "4-minmax": "repeat(4, minmax(150px, 1fr))",
    },
    colors: {
      gray: {
        50: "#FAFAFA",
        100: "#F5F5F5",
        200: "#E5E5E5",
        300: "#D4D4D4",
        400: "#A3A3A3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
      },
      darkslate: {
        50: "#3D3D3D",
        100: "#2C2C2C",
        200: "#262626",
        300: "#202020",
        400: "#1A1A1A",
        500: "#171717",
        600: "#141414",
        700: "#111111",
        800: "#0E0E0E",
        900: "#0B0B0B",
      },
      primary: {
        500: PRIMARY_TEXT,
      },
    },
  },
  presets: [
    presetUno(),
    presetTypography({
      cssExtend: {
        a: { color: PRIMARY_TEXT },
        "h1,h2,h3,h4": { "font-family": "CabinetGrotesk, sans-serif" },
      },
    }),
  ],
});
