const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

// Find the project and workspace roots
const projectRoot = __dirname;
// The workspace root is two levels up from apps/mobile
const workspaceRoot = path.resolve(projectRoot, "../..");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. Fix for hoisted 'expo' package resolution errors in monorepos
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // If expo/AppEntry or some other entry point is looking for "../App" or "../../App"
  // redirect it to our local index.js
  if (moduleName.endsWith("/App") || moduleName.endsWith("\\App")) {
    if (context.originModulePath && context.originModulePath.includes("expo")) {
      return {
        filePath: path.resolve(projectRoot, "index.js"),
        type: "sourceFile",
      };
    }
  }

  // Ensure expo-router entry can be found in a hoisted environment
  if (moduleName === "expo-router/entry") {
    // Try to resolve it locally first, then fall back to root node_modules
    try {
      return context.resolveRequest(
        context,
        path.resolve(projectRoot, "node_modules/expo-router/entry"),
        platform,
      );
    } catch {
      return context.resolveRequest(
        context,
        path.resolve(workspaceRoot, "node_modules/expo-router/entry"),
        platform,
      );
    }
  }

  // Default resolution for all other modules
  return context.resolveRequest(context, moduleName, platform);
};

// Awilix 12+ includes loadModules which depends on fast-glob and Node built-ins.
// In React Native, these are not available. Metro still tries to resolve them
// through static analysis of the library's ESM build.
// We provide empty mocks for these modules to prevent bundling errors.
const emptyMockPath = path.resolve(__dirname, "mocks/empty.js");

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "fast-glob": emptyMockPath,
  fs: emptyMockPath,
  path: emptyMockPath,
  os: emptyMockPath,
  glob: emptyMockPath,
};

config.resolver.assetExts.push("wasm");

module.exports = config;
