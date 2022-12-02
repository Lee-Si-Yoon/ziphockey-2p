const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const BASE_JS = "./src/public/js/";

module.exports = {
  devtool: "source-map",
  entry: {
    app: BASE_JS + "app.js",
    dom: BASE_JS + "dom.js",
  },
  //mode: "development", //only on dev mode
  //watch: true, //only on dev mode
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        loader: "file-loader",
        options: {
          name: "imgs/[name].[ext]",
        },
      },
      // 웹폰트 로더
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        loader: "file-loader",
        options: {
          name: "fonts/[name].[ext]",
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
};
