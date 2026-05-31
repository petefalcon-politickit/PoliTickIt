# Snap Data Files

This folder contains one JSON file per PoliSnap.

## File naming

`{snapId}.json` — the value must match the snap's `"id"` field.

## Format

Each file is the **camelCase** SNAP JSON (same format as the
constructed files in `apps/skill-execution/PoliSnaps/constructed/`).
The API deserialises them with `PropertyNameCaseInsensitive = true`
so the JSON keys map cleanly to the PascalCase C# model.

## How to add / update snaps without redeploying

1. Drop a new `{snapId}.json` file into this folder.
2. Restart the API **or** call `POST /admin/reload`.
3. The new snap is immediately available at `GET /snaps`.

## Data-only deployment (no code redeploy)

```powershell
dotnet msbuild PoliTickIt.Api.csproj `
  /t:DeployDataFiles `
  /p:DeployTarget=C:\path\to\deployed\app

# Then hot-reload:
Invoke-RestMethod -Method Post -Uri https://<host>/admin/reload
```
