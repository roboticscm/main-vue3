const path = require('path');
const base = require('./webpack.base');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(base, {
  // mode: 'production',
  mode: 'development',
  output: {
    filename: '[name].[contentHash].bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  optimization: {
    minimizer: [new OptimizeCssAssetsWebpackPlugin(), new TerserWebpackPlugin()]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contentHash].css'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true
      }
    })
  ],

  module: {
    rules: [
      {
        test: /\.css$/i,
        // revert order
        use: ['vue-style-loader', MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/i,
        // revert order
        use: [
          'vue-style-loader',
          // Third, extract css into files
          MiniCssExtractPlugin.loader,
          // Second, turn css into commonjs
          'css-loader',
          //  First, turn scss into css
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              // Load common SCSS [ Vars & Mixins ]
              resources: '@/../../sass/sass/helpers/_variables.scss'
            }
          }
        ]
      }
    ]
  }
});
