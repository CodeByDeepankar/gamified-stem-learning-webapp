import type { NextConfig } from "next";
import withPWA from '@ducanh2912/next-pwa';
const { i18n } = require('./next-i18next.config');

const nextConfig: NextConfig = {
  i18n,
  /* config options here */
};

const withPWAConfig = withPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
});

export default withPWAConfig(nextConfig);
