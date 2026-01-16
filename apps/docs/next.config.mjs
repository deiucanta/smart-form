import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  basePath: isProduction ? '/smart-form' : '',
  assetPrefix: isProduction ? '/smart-form/' : '',
  images: {
    unoptimized: true,
  },
};

export default withMDX(config);
