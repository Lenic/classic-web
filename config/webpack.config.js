import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import _ from 'underscore';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const targetPath = path.resolve(__dirname, '../src/client')
  , files = fs.readdirSync(targetPath)

const folders = _.chain(files)
  .map(v => ({ name: v, path: path.resolve(targetPath, v) }))
  .filter(v => fs.statSync(v.path).isDirectory());

export default {
  entry: folders.map(v => [v.name, path.resolve(v.path, 'index.js')])
    .object()
    .extend({
      vendor: [
        'jquery',
        'underscore',
        path.resolve(__dirname, './css/index.global.less')
      ],
    })
    .value(),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.attached\.less$/,
        exclude: /\.global\.less$/,
        use: [
          { loader: 'style-loader/useable' },
          { loader: 'css-loader' },
          { loader: 'less-loader' },
        ],
      },
      {
        test: /\.global\.less$/,
        exclude: /\.attached\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            { loader: 'less-loader' },
          ],
        }),
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.less'],
  },
  plugins: folders
    .map(v => new HtmlWebpackPlugin({
      filename: `${v.name}.html`,
      template: path.resolve(v.path, 'index.html'),
      chunks: ['manifest', 'vendor', v.name],
    }))
    .concat([
      new webpack.optimize.CommonsChunkPlugin({
        name: ['vendor', 'manifest'],
        minChunks: Infinity,
      }),
      new ExtractTextPlugin('css/[name].css'),
    ])
    .value(),
}
