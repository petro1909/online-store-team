const path = require('path');

module.exports = {
    stats: 'summary',
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      client: {
        overlay: false
      },
      historyApiFallback: {
        rewrites: [
          { from: /./, to: '/index.html' }, // all request to index.html
        ],
      },  
      static: {
        directory:path.resolve(__dirname, './dist'),
      },
    },
};