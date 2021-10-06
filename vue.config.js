const path = require("path");
const webpack = require("webpack");
require("dotenv").config(); // Pass address data

module.exports = {
  configureWebpack: {
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
  },
  devServer: {
    proxy: {
      "^/user": {
        target: "http://localhost:4000",
      },
    },
  },
};
