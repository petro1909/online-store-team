const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { NetlifyPlugin } = require('netlify-webpack-plugin');

const baseConfig = {
    entry: path.resolve(__dirname, './src/index'),
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                //exclude: /node_modules/,
            },
            {
              test: /\.(png|jpg|gif|svg|eot|ttf|woff|wav|mp3)$/,
              type: 'asset/resource'
            },
            {
              test: /\.html$/i,
              loader: "html-loader",
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, './dist'),
        publicPath: "/"
    },
    plugins: [
        new NetlifyPlugin({
          redirects: [
            {
              from: "/*",
              to: "/index.html",
              status: 200
            }
          ]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new CleanWebpackPlugin(),
        new EslintWebpackPlugin({ 
          extensions: 'ts',
          emitError: false,
          emitWarning: false,
          failOnError: false,
          failOnWarning: false
        }),
    ],
};

module.exports = ({ mode }) => {
    const isProductionMode = mode === 'prod';
    const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

    return merge(baseConfig, envConfig);
};