var webpack = require('webpack');
var path = require('path');
module.exports = {
    entry: {
        validatorJS: "./src/index.js"
    },
    output: {
        path: path.resolve(__dirname, '../../dist'),
        filename: "walnut-validator.js",
        library: "WalnutValidator",
        libraryTarget: "amd"
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['', '.js']
    },
    babel: {
        presets: ['es2015', 'stage-2'],
        plugins: ['transform-runtime']
    }
};