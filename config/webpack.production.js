const path = require('path')
const moment = require('moment')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const rules = require('./webpack.rules')
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'main.js',
    chunkFilename: '[name].[hash].js'
  },
  target: 'electron-renderer',
  resolve: {
    modules: ['node_modules', 'src']
  },
  module: {
    rules: rules.concat([{
        test: /\.jsx?$/,
        loader: ['babel-loader']
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          }
        ])
      },
      {
        test: /\.less$/,
        exclude: /(node_modules|antd)/,
        loader: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          {
            loader: 'less-loader',
            options: {
              relativeUrls: false
            }
          }
        ])
      },
      {
        test: /antd\.less$/,
        loader: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          {
            loader: 'less-loader',
          }
        ])
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          'url-loader?limit=8192&name=image/[hash].[ext]'
        ]
      }
    ])
  },
  plugins: [
    new WebpackCleanupPlugin({
      exclude: ['vendor.js']
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'API_SERVER': JSON.stringify('http://localhost:8888')
    }),
    new webpack.ProvidePlugin({
      'React': 'react'
    }),
    new ExtractTextPlugin({
      disable: false,
      allChunks: true,
      filename: '[name].css'
    }),
    new HtmlWebpackPlugin({
      template: 'template/index.prod.html',
      hash: true
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.BannerPlugin(`${moment().format('YYYY-MM-DD HH:mm:ss')}`)
  ]
}