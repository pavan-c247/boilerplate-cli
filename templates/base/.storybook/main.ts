// This file has been automatically migrated to valid ESM format by Storybook.
import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/nextjs-vite";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  addons: ["@storybook/addon-docs"],

  framework: {
    name: "@storybook/nextjs-vite",
    options: {
      nextConfigPath: path.resolve(__dirname, "../next.config.ts"),
    },
  },

  viteFinal: async (config) => {
    const srcPath = path.resolve(__dirname, "../src");
    
    // Configure Vite resolve alias for @/ imports
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": srcPath,
    };

    // Configure Sass to handle @/ imports
    config.css = config.css || {};
    config.css.preprocessorOptions = config.css.preprocessorOptions || {};
    config.css.preprocessorOptions.scss = {
      ...(config.css.preprocessorOptions.scss || {}),
      api: 'modern-compiler',
      importer: {
        canonicalize(url: string): URL | null {
          if (!url.startsWith("@/")) {
            return null; // Let Sass use default resolution
          }
          
          const relativePath = url.replace(/^@\//, "");
          const basePath = path.resolve(srcPath, relativePath);
          const dir = path.dirname(basePath);
          const basename = path.basename(basePath);
          
          // Try different file combinations
          const candidates = [
            basePath,
            `${basePath}.scss`,
            path.join(dir, `_${basename}.scss`),
            path.join(dir, `_${basename}`),
          ];
          
          for (const candidate of candidates) {
            if (fs.existsSync(candidate)) {
              try {
                return new URL(`file://${candidate}`);
              } catch {
                return new URL(`file:///${candidate.replace(/\\/g, '/')}`);
              }
            }
          }
          
          // Return expected path even if it doesn't exist
          try {
            return new URL(`file://${basePath}.scss`);
          } catch {
            return new URL(`file:///${basePath.replace(/\\/g, '/')}.scss`);
          }
        },
        
        load(canonicalUrl: URL): { contents: string; syntax: 'scss' | 'css' } | null {
          let filePath = canonicalUrl.pathname;
          
          // Handle Windows paths (file:///C:/path -> C:/path)
          if (process.platform === 'win32') {
            if (filePath.match(/^\/[A-Z]:/i)) {
              filePath = filePath.substring(1);
            }
            filePath = filePath.replace(/\//g, '\\');
          }
          
          if (fs.existsSync(filePath)) {
            return {
              contents: fs.readFileSync(filePath, 'utf-8'),
              syntax: filePath.endsWith('.scss') || filePath.endsWith('.sass') ? 'scss' : 'css',
            };
          }
          
          return null;
        },
      },
      includePaths: [srcPath],
    };

    // Configure esbuild to handle JSX in .js files
    // Use optimizeDeps for dependency pre-bundling
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.esbuildOptions = config.optimizeDeps.esbuildOptions || {};
    config.optimizeDeps.esbuildOptions.loader = {
      ...(config.optimizeDeps.esbuildOptions.loader || {}),
      '.js': 'jsx',
    };

    // Also configure esbuild for regular transforms
    config.esbuild = config.esbuild || {};
    config.esbuild.include = /\.(jsx?|tsx?)$/;
    config.esbuild.jsx = 'automatic';

    return config;
  },
};

export default config;
