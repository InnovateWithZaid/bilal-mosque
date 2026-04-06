# Bilal Expo App

Bilal is now structured as a React Native app built with Expo and Expo Router.

## What Changed

- The repo root now boots an Expo native app instead of the previous Vite web app.
- Main native routes live in `app/`.
- Shared native logic lives in `native/`.
- The old Vite/web source and build files have been removed so the repo is Expo-native only.

## Features In This Native Conversion

- Native bottom-tab navigation with Expo Router
- Mosque discovery screens for home, mosques, favorites, map, details, community, and issue reporting
- Local device persistence for favorites, mosque data, reports, and admin demo sessions
- Native map screen using `react-native-maps`
- Android app config with package ID `com.bilalmosque.app`
- Generated icon, adaptive icon, and splash assets in `assets/`

## Run The App

1. Install dependencies:

```bash
npm install
```

2. Start Expo:

```bash
npm run start
```

3. Run on Android:

```bash
npm run android
```

## Useful Commands

```bash
npm run typecheck
npx expo config --type public
npx expo export --platform android --output-dir .expo-export
```

## Current Data/Auth Behavior

- Mosque data, announcements, reports, favorites, and demo admin sessions are stored locally on-device.
- Core admin demo PIN: `0000`
- Mosque admin demo PIN: `1234`

## Notes

- The Expo conversion is native-first. The previous web UI is not the active runtime anymore.
- If you add more Expo packages later, prefer `npx expo install ... --npm` on this machine.
