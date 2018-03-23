const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const devPort = 8888

const rules = require('./webpack.rules')
module.exports = {
  entry: [
    'react-hot-loader/patch',
    './src/index.js'
  ],
  target: 'electron-renderer',
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'main.js',
    publicPath: `http://localhost:${devPort}/`
  },
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    alias: {
      constant: resolve('constant')
    },
    modules: ['node_modules', 'src']
  },
  module: {
    rules: rules.concat([
      {
        test: /\.jsx?$/,
        loader: ['babel-loader', 'eslint-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        exclude: /(node_modules|antd)/,
        loader: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: 'config/postcss.config.js'
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              relativeUrls: false
            }
          }
        ]
      },
      {
        test: /antd\.less$/,
        loader: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: 'url-loader?limit=8192&name=image/[hash].[ext]'
      }
    ])
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      'React': 'react'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('dev'),
      'API_SERVER': JSON.stringify(`http://localhost:${devPort}`)
    })
  ],
  devServer: {
    before(app) {
      app.use(function(req, res, next) {
        const p = path.join(__dirname, '../api', /\.json$/.test(req.path) ? req.path : req.path + '.json')
        if (fs.existsSync(p)) {
          res.json(JSON.parse(fs.readFileSync(p, 'utf8')))
        } else {
          next()
        }
      })
    }
  }
}


function resolve(dir) {
  return path.resolve(__dirname, `../src/${dir}`)
}