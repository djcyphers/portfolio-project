const path = require("path");
const webpack = require("webpack");
require("dotenv").config(); // Pass address data

module.exports = {
  outputDir: "./dist",
  publicPath: "./",
  configureWebpack: {
    devtool: "source-map",
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jquery: "jquery",
        "window.jQuery": "jquery",
        jQuery: "jquery",
      }),
    ],
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [path.resolve(__dirname, "./src/assets/scss/global.scss")],
    },
  },
  chainWebpack: (config) => {
    config.module.rules.delete("eslint");
    config.plugin("copy").tap(([options]) => {
      options[0].ignore.push("**/uploads/**");
      return [options];
    });
  },
  devServer: {
    port: 8080,
    proxy: {
      "/user": {
        target: "http://127.0.0.1:4000/",
        changeOrigin: true,
      },
      "/gallery": {
        target: "http://127.0.0.1:4000/",
        changeOrigin: true,
      },
      "/blog": {
        target: "http://127.0.0.1:4000/",
        changeOrigin: true,
      },
      "/openai": {
        target: "http://127.0.0.1:4000/",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://127.0.0.1:4000/",
        changeOrigin: true,
      },
    },
  },
};
