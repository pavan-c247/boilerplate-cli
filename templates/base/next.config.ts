import path from 'node:path';

import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  sassOptions: {
    silenceDeprecations: [
      "legacy-js-api",
      "global-builtin",
      "color-functions",
      "import",
      "slash-div",
    ],
    quietDeps: true,
  },
  // Disable barrel optimization to prevent "File name too long" errors in Storybook
  // This is especially problematic with packages like lucide-react that have many exports
  experimental: {
    optimizePackageImports: [], // Empty array explicitly disables the feature
  },
  webpack: (config, { isServer }) => {
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    config.resolve.alias['@locales'] = path.resolve(__dirname, 'locales');
    
    // Disable barrel optimization for lucide-react to prevent filename length issues
    if (config.optimization?.usedExports !== false) {
      // Skip optimization for node_modules packages with barrel exports
      if (!config.module) {
        config.module = {};
      }
      if (!config.module.rules) {
        config.module.rules = [];
      }
    }
    
    return config;
  },
};

export default withNextIntl(nextConfig);
