const path = require("path");
const webpack = require("webpack");
require("dotenv").config(); // Pass address data
const crypto = require("crypto");

/**
 * The MD4 algorithm is not available anymore in Node.js 17+ (because of library SSL 3).
 * In that case, silently replace MD4 by the MD5 algorithm.
 */
try {
  crypto.createHash("md4");
} catch (e) {
  console.warn('Crypto "MD4" is not supported anymore by this Node.js version');
  const origCreateHash = crypto.createHash;
  crypto.createHash = (alg, opts) => {
    return origCreateHash(alg === "md4" ? "md5" : alg, opts);
  };
}

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
