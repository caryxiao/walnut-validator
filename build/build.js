var fs = require("fs");
var rollup = require("rollup");
var uglify = require("uglify-js");
var babel = require("rollup-plugin-babel");
var replace = require("rollup-plugin-replace");

var version = process.env.VERSION || require('../package.json').version
var banner =
    '/*!\n' +
    ' * walnut-validator.js v' + version + '\n' +
    ' * (c) ' + new Date().getFullYear() + ' Cary Xiao\n' +
    ' * Released under the MIT License.\n' +
    ' */';

rollup.rollup({
    entry: "src/index.js",
    plugins: [
        babel({
            babelrc: false,
            exclude: 'node_modules/**',
            presets: [ "es2015-rollup" ]
        })
    ]
})
    .then(function (bundle) {
        return write('dist/walnut-validator.common.js', bundle.generate({
            format: 'cjs',
            banner: banner,
            globals: {
                jquery: 'jQuery'
            }
        }).code)
    })
    .then(function () {
        return rollup.rollup({
            entry: "src/index.js",
            plugins: [
                replace({
                    'process.env.NODE_ENV': "'production'"
                }),
                babel({
                    babelrc: false,
                    exclude: 'node_modules/**',
                    presets: [ "es2015-rollup" ]
                })
            ]
        })
            .then(function (bundle) {
                return write('dist/walnut-validator.js', bundle.generate({
                    format: 'umd',
                    moduleName: 'WalnutValidator',
                    banner: banner,
                    globals: {
                        jquery: 'jQuery'
                    }
                }).code)
            })
    })
    .then(function () {
        return rollup.rollup({
                entry: "src/index.js",
                plugins: [
                    replace({
                        'process.env.NODE_ENV': "'production'"
                    }),
                    babel({
                        babelrc: false,
                        exclude: 'node_modules/**',
                        presets: [ "es2015-rollup" ]
                    })
                ]
            })
            .then(function (bundle) {
                var code = bundle.generate({
                    format: 'umd',
                    moduleName: 'WalnutValidator',
                    globals: {
                        jquery: 'jQuery'
                    }
                }).code;

                var minified = banner + '\n' + uglify.minify(code, {
                        fromString: true,
                        output: {
                            ascii_only: true
                        }
                    }).code;
                return write('dist/walnut-validator.min.js', minified);
            })
    })
    .catch(logError);

function write (dest, code) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(dest, code, function (err) {
            if (err) return reject(err)
            console.log(blue(dest) + ' ' + getSize(code))
            resolve()
        })
    })
}

function blue (str) {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

function getSize (code) {
    return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
    console.log(e)
}