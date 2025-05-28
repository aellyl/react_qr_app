const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: (process.env.PUBLIC_URL || "/") + "/", // supports GitHub Pages + dev
    clean: true,
  },
  devtool: isProd ? false : "source-map",
  devServer: {
    static: path.join(__dirname, "public"),
    historyApiFallback: true,
    port: 3000,
    open: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: (modulePath) =>
          /node_modules/.test(modulePath) &&
          !/(@launchdarkly\/session-replay|@launchdarkly\/observability)/.test(modulePath),
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }]
            ],
            plugins: [
              "@babel/plugin-proposal-optional-chaining",
              ["@babel/plugin-transform-classes", {}, "ld-transform-classes"]
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
    }),
  ],
};
