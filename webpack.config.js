const path = require('path'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = {
  entry: './src/index.js', // 不写默认也是它 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: ['babel-loader'] },
      { test: /\.css$/, use: ['style-loader', 'css-loader']},
      { test: /\.(mp4|jpg|png)$/, use: ['file-loader']},
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', title: 'hehe ~~~',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  devServer: {
    contentBase: "./dist",
    progress:true,
    hot: true,
    port: 8080,
  }
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.plugins.push(new CleanWebpackPlugin());
  }
  return config;
};