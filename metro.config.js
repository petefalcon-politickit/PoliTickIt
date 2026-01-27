const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

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

module.exports = config;
