const path = require('path'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = {
  entry: './src/index.js', // 不写默认也是它 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash].js',
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: ['babel-loader'] },
      { test: /\.css$/, use: ['style-loader', 'css-loader']},
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', title: 'hehe ~~~',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  }
};
module.exports = config;