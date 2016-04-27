var webpack = require('webpack');
var path = require('path');

module.exports = [{
    entry: './test/unit/specs/index.js',
    output: {
        path: path.resolve(__dirname, "../../test/unit"),
        filename: "specs.js"
    },
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
                exclude: [
                    path.resolve(__dirname, '../../test/unit'),
                    path.resolve(__dirname, '../../node_modules')
                ]
            }
        ]
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, '../../src')
        }
    },
    babel: {
        presets: ['es2015', 'stage-2'],
        plugins: ['transform-runtime']
    },
    devServer: {
        contentBase: './test/unit',
        noInfo: true,
        hot: true
    },
    devtool: 'source-map'
}];