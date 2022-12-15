const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      historyApiFallback: true,
      static: {
        directory:path.resolve(__dirname, './dist'),
      }
    },
};