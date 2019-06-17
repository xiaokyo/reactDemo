const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const { _csslocalIdentName } = require("./config/web.config");

module.exports = {
  // 入口
  entry: {
    app: ["@babel/polyfill", path.join(__dirname, "./src/index.js")]
    // vendor: ['react', 'react-router-dom', 'react-dom', 'redux', 'react-redux'],
  },
  // 输出
  output: {
    path: path.join(__dirname, "dist"),
    filename: "assets/js/[name].[hash].js",
    chunkFilename: "assets/js/chunks/[name].[chunkhash].js",
    publicPath: "/"
  },
  resolve: {
    alias: {
      // 简略引用组件路径
      "@pages": path.join(__dirname, "src/pages"),
      "@components": path.join(__dirname, "src/components"), //component
      "@router": path.join(__dirname, "src/router"), //router
      "@images": path.join(__dirname, "src/images"), //images

      //   redux
      "@store": path.join(__dirname, "src/store"),
      "@actions": path.join(__dirname, "src/store/actions"),
      "@reducers": path.join(__dirname, "src/store/reducers")
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        //打包自定义的样式文件
        test: /\.(less|css)$/,
        include: /(src)/, //指定文件夹中的样式文件
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: _csslocalIdentName
            }
          },
          "postcss-loader",
          "less-loader"
        ]
      },
      {
        // 第三方样式包的处理
        test: /\.(less|css)$/,
        include: /(node_modules)/, //指定文件夹中的样式文件
        use: [
          { loader: MiniCssExtractPlugin.loader },
          "css-loader",
          "postcss-loader",
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192, //小于8kg的会进行base64的保存方式导出到js
              name: "assets/images/[name].[hash].[ext]"
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(__dirname, "public/index.html")
    }),
    new MiniCssExtractPlugin({
      // 压缩css
      filename: "assets/css/[name].[contenthash].css",
      chunkFilename: "assets/css/chunks/[id].[contenthash].css"
    }),
    new OptimizeCssAssetsPlugin()
  ]
};
