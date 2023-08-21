const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  outputDir: "dist",
  filenameHashing: false,
  pages: {
    content: {
      entry: "./src/content.js",
    },
    popup: {
      entry: "./src/popup.js",
      filename: "popup.html",
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
