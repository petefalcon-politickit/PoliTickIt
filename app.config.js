/**
 * Workspace-root adapter config for monorepo builds.
 *
 * RNGP (React Native Gradle Plugin) passes --project-root=<workspaceRoot> to
 * `expo export:embed`, so expo CLI calls getConfig(workspaceRoot) and looks for
 * routes at `workspaceRoot/app/` — which does not exist.
 *
 * By placing app.config.js here with `extra.router.root = 'apps/mobile/app'`,
 * expo CLI computes routerRoot = 'apps/mobile/app' and the Babel plugin finds
 * routes at the correct location: `PoliTickIt/apps/mobile/app/`.
 *
 * This file is intentionally minimal — it delegates to apps/mobile/app.json
 * for all real config, only overriding the router root.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mobileAppJson = require('./apps/mobile/app.json');
const mobileConfig = mobileAppJson.expo;

module.exports = {
  ...mobileConfig,
  extra: {
    ...mobileConfig.extra,
    router: {
      // Override: path is relative to this workspaceRoot (PoliTickIt/)
      root: 'apps/mobile/app',
    },
  },
};
