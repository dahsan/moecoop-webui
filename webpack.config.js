var path = require('path')
var webpack = require('webpack')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
var FaviconsWebpackPlugin = require('favicons-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var appName = '生協の知恵袋'

module.exports = (env, argv) => {
  return {
    entry: './src/main.js',
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'build.js'
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
            }
            // other vue-loader options go here
          }
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader',
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(png|svg|ico)$/,
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]?[hash]'
          }
        },
        {
          test: /\.styl$/,
          loader: ['style-loader', 'css-loader', 'stylus-loader'],
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
        },
      ]
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    devServer: {
      historyApiFallback: true,
      noInfo: true
    },
    devtool: argv.mode == 'production' ? 'none' : 'eval-source-map',
    plugins: [
      new VueLoaderPlugin(),
      new FaviconsWebpackPlugin({
        logo: './src/assets/moecoop.svg',
        prefix: 'images/',
        inject: true,
        title: appName,
      }),
      new HtmlWebpackPlugin({
        title: appName,
        template: '!!html-loader!./index.html'
      })
    ]
  }
}
