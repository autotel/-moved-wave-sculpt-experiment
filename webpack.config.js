const path = require('path')
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')
const CopyPlugin = require("copy-webpack-plugin");

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
        new CopyPlugin({
            patterns: [
                { from: "src/scaffolding/MagicPlayer.js", to: "./MagicPlayer.js" },
                { from: "src/scaffolding/ping-pong-processor.js", to: "./ping-pong-processor.js" },
                { from: "src/index.html", to: "./index.html" },
            ],
        }),
    ],
    module:{
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    // "style-loader",
                    // Translates CSS into CommonJS
                    // "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ],
    },
    experiments: {
        syncWebAssembly: true
    },
};
