// app.config.js
//
// Resolves the Expo config dynamically based on the APP_VARIANT env var.
//  - APP_VARIANT=development  →  dev client build, separate bundle id, "(Dev)" suffix
//  - anything else            →  production build, unchanged from app.json
//
// app.json is still the source of truth for version, icons, and everything else.
// This file only overrides the bits that differ per variant.

const appJson = require('./app.json');

const IS_DEV = process.env.APP_VARIANT === 'development';

module.exports = () => {
  const base = appJson.expo;

  const config = {
    ...base,
    name: IS_DEV ? `${base.name} (Dev)` : base.name,
    ios: {
      ...base.ios,
      bundleIdentifier: IS_DEV
        ? `${base.ios.bundleIdentifier}.dev`
        : base.ios.bundleIdentifier,
    },
    android: {
      ...base.android,
      package: IS_DEV ? `${base.android.package}.dev` : base.android.package,
    },
    plugins: [
      ...(base.plugins ?? []),
      [
        'expo-notifications',
        {
          icon: './assets/icon.png',
          color: '#ffffff',
        },
      ],
    ],
  };

  return config;
};
