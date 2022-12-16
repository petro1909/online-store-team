const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      historyApiFallback: {
        rewrites: [
          { from: /./, to: '/index.html' }, // all request to index.html
        ],
      },  
      static: {
        directory:path.resolve(__dirname, './dist'),
      }
    },
};