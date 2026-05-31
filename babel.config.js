module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        require("babel-plugin-module-resolver"),
        {
          root: ["./apps/mobile"],
          extensions: [
            ".ios.js",
            ".android.js",
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
            ".json",
          ],
          alias: {
            "@": "./apps/mobile",
          },
        },
      ],
    ],
  };
};
