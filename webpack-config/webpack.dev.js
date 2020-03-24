const path = require('path');
const base = require('./webpack.base');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(base, {
  mode: 'development',
  // devtool: 'none',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  devServer: {
    // host: '0.0.0.0',
    port: 8081,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    inline: true,
    hot: true,
    stats: 'minimal',
    contentBase: __dirname,
    overlay: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        // revert order
        use: ['style-loader', 'vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/i,
        // revert order
        use: [
          // third, Inject styles into DOM
          'style-loader',
          'vue-style-loader',
          // second, turn css into commonjs
          'css-loader',
          //  first, turn scss into css
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
