// UPDATE: tailwind.config.ts
// garanta que o projeto já tenha as presets do shadcn
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // (presets do shadcn já devem injetar tokens de cor)
    },
  },
  plugins: [],
} satisfies Config;
