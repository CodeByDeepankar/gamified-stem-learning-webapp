/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'or'], // 'or' is the ISO code for Odia
  },
  localePath: './src/data/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
