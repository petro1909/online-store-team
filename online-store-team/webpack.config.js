const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, './dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new CleanWebpackPlugin(),
        new EslintWebpackPlugin({ extensions: 'ts' }),
        new CopyWebpackPlugin({
          patterns:[
              {
                  from: './src/components/view/*.html',
                  to: path.resolve(__dirname, 'dist/components/view/[name].html')
              }
          ]
      })
    ],
};

module.exports = ({ mode }) => {
    const isProductionMode = mode === 'prod';
    console.log(isProductionMode)
    const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

    return merge(baseConfig, envConfig);
};