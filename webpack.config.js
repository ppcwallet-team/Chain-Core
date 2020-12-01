const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

console.log(process.env.CHAINCORE_ENV);
const production = process.env.CHAINCORE_ENV === 'production';

const devPlugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
    })
];
const prodPlugins = devPlugins.concat([
    new UglifyJsPlugin(),
]);

const productionPlugins = !production ? devPlugins : prodPlugins;
const runningTests = process.env.SCATTER_ENV === 'testing';
const externals = runningTests ? [nodeExternals()] : [];

module.exports = {
	entry: {
        // bundle: path.resolve(__dirname, './engine/main.js'),
        inject: path.resolve(__dirname, './inject/main.js'),
    },
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "[name].js"
	},
	resolve: {

	},
    module: {
    	rules: [
    		//将所有目录下的es6代码转译为es5代码，但不包含node_modules目录下的文件
    		{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
    		{ test: /\.less$/, loader: 'style!css!less' }
    	]
    },
	plugins: [
        new ExtractTextPlugin({ filename: '[name]', allChunks: true }),
        new IgnoreEmitPlugin(/\.omit$/)
    ].concat(productionPlugins),
    stats: { colors: true },
    devtool: 'source-map', //inline-
    node:{
      fs:'empty',
      child_process:'empty'
    },
    externals
};


