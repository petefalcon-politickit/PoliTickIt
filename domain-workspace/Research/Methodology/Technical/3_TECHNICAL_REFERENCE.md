# Technical Reference: Expo & Local Development

## 1. Environment Setup

- **Mobile**: `npm run mobile:start` (Expo Router).
- **Backend**: `dotnet run --project apps/services/PoliTickIt.Api`.
- **API URL**: For physical devices, use the machine's local IP (e.g., `http://10.0.0.252:5000`).

## 2. Useful Commands

- `npm run mobile:test`: Runs Jest suite.
- `dotnet build apps/services/PoliTickIt.Platform.sln`: Rebuilds the entire backend.
- `ls -R documentation`: Verifies the Documentation Hub integrity.

## 3. SQLite Debugging

To inspect the local mobile database:

1.  Connect via `expo-sqlite` devtools.
2.  Query `PRAGMA user_version` to check migration status.
3.  Inspect `snaps` and `snap_elements` to verify the Truth Mirror success.
