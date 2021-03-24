const path = require('path')
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: false,
    },
    plugins: [
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, './src/rust'),
        }),
    ],
    experiments:{
        syncWebAssembly: true
    },
};
