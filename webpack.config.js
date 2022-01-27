const path = require('path');

const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './client/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'client.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-react' ]
          }
        }
      },
      {
        test: /\.svg$/,
        use: 'react-svg-loader'
      }
    ]
  },
  resolve: {
    alias: {
      react: 'camunda-modeler-plugin-helpers/react'
    },
    fallback: {
      'path': require.resolve('path-browserify'),
      'buffer': require.resolve('buffer/')
    }
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: [ 'buffer', 'Buffer' ],
    })
  ]
};
