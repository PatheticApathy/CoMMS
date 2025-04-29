import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin';

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
			primary: 'var(--color-primary)',
			secondary: 'var(--color-secondary)',
			accent: 'var(--color-accent)',
			background: 'var(--color-background)',
			surface: 'var(--color-surface)',
		  },
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    plugin(function ({ addBase }: { addBase: (styles: Record<string, any>) => void }) {
      addBase({
        body: {
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-surface)',
        },
      });
    }),
  ],
} satisfies Config;
