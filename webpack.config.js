const path = require('path');

const webpack = require('webpack');

const CamundaModelerWebpackPlugin = require('camunda-modeler-webpack-plugin');

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
        test: /\.svg$/,
        use: 'react-svg-loader'
      }
    ]
  },
  resolve: {
    fallback: {
      'path': require.resolve('path-browserify'),
      'buffer': require.resolve('buffer/')
    }
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: [ 'buffer', 'Buffer' ],
    }),
    new CamundaModelerWebpackPlugin()
  ]
};
