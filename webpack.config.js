var webpack = require('webpack');
var resolve = require('path').resolve;
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = env => {

  is_production = env && env.production;
  var addPlugin = (add, plugin) => add ? plugin : undefined;
  var ifProd = plugin => addPlugin(is_production, plugin);
  var removeEmpty = array => array.filter(i => !!i);

  return {
    entry: ['babel-polyfill', './glue/index.js'],
    output: {
      filename: 'bundle.js',
      path: resolve(__dirname, 'out/dist'),
      pathinfo: !is_production,
    },
    context: resolve(__dirname, 'out/gccx'),
    devtool: is_production ? 'source-map' : 'eval',
    bail: is_production,
    node: {
      fs: 'empty',
    },
    module: {
      loaders: [{
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: [
          /node_modules/,
          /compiled/,
          /\.asm\.js$/,
          /prefix\.js$/,
          /postfix\.js$/],
      },
      {
        test: /\.wasm$/,
        loaders: ['arraybuffer-loader'],
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }],
    },
    plugins: removeEmpty([
      new CopyWebpackPlugin([
        { from: './index.html', to: '../dist/index.html' }
      ]),

      ifProd(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
        quiet: true,
      })),

      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true, // eslint-disable-line
          warnings: false,
        },
      }))

    ]),
  };
};
