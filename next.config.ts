import type { NextConfig } from "next";
import withPWA from '@ducanh2912/next-pwa';
import i18nConfig from './next-i18next.config.js';

const nextConfig: NextConfig = {
  // Note: App Router warns about i18n in next.config; keeping for completeness
  i18n: (i18nConfig as { i18n: { defaultLocale: string; locales: string[] } }).i18n,
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
  pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
  pathname: '**',
      }
    ],
  },
};

const withPWAConfig = withPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development' || process.env.NEXT_BUILD === 'true',
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /\/_next\/static\/css\/.*/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'next-static-css',
        },
      },
      {
        urlPattern: /\/_next\/static\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'next-static',
          expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|mp3|mp4|wav|ogg|woff2|woff|ttf)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-assets',
          expiration: { maxEntries: 1000, maxAgeSeconds: 60 * 60 * 24 * 365 },
        },
      },
      {
        urlPattern: /^https?:\/\/.*$/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'http-calls',
          networkTimeoutSeconds: 10,
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
        },
      },
    ],
  },
  fallbacks: {
    document: '/offline.html',
  },
});

export default withPWAConfig(nextConfig);
