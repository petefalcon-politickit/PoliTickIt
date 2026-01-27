# Expo Development Cheatsheet - PoliTickIt

Commands for building, starting, and managing the Expo development environment for the PoliTickIt mobile project.

## Development Server

Start the Expo development server (Metro bundler):

```bash
# Standard start (choose platform in terminal)
npm start

# Start specifically for Android
npm run android

# Start specifically for iOS (macOS only)
npm run ios

# Start for Web
npm run web
```

## Useful Flags

When running `npx expo start`, you can use these flags:

- `-c` or `--clear`: Clear the Metro bundler cache (fix most sync/load issues).
- `--tunnel`: Use a tunnel to connect your physical device if on a different network.
- `--localhost`: Force connection via localhost rather than LAN IP.

## Troubleshooting

### Reset Project

Run the custom reset script to clean the project structure:

```bash
npm run reset-project
```

### Dependency Re-installation

If you encounter module errors:

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Expo Router Routes

To see all available routes in the app:

```bash
npx expo run:android --list-routes # or ios
```

## Production Builds (EAS)

_Note: Requires `eas-cli` installed globally (`npm install -g eas-cli`)_

### Configure EAS

```bash
eas build:configure
```

### Build Android/iOS

```bash
# Android APK/Bundle
eas build --platform android

# iOS Build
eas build --platform ios
```

## Local Native Builds (Development Clients)

If you need to build the native code locally (requires Android Studio / Xcode):

```bash
# Prebuild and run on Android
npx expo run:android

# Prebuild and run on iOS
npx expo run:ios
```

## Credentials & Signing

### List Project Credentials

```bash
eas credentials
```

### Metadata (app.json)

Configuration for app icons, splash screens, and bundle identifiers are located in [app.json](../app.json).
