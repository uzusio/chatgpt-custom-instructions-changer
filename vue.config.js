const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  outputDir: "dist",
  filenameHashing: false,
  pages: {
    app: {
      template: "public/index.html",
      entry: "./src/main.js",
      title: "App",
    },
    content: {
      entry: "./src/content.js",
    },
    popup: {
      entry: "./src/popup.js",
    },
  },
  css: {
    extract: false,
  },
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [{ from: "public/assets", to: "icons" }],
      }),
    ],
  },
};
