const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const build = { minimize: true, sourceMap: 'source-map' };

if (process.env.NODE_ENV !== 'production') {
    build.minimize = false;
    build.sourceMap = 'inline-source-map';
}

const webpackConfig = {
    // Entry
    entry: ['@babel/polyfill', './src/scripts/main.js'],

    // Output
    output: {
        filename: './bundle.js',
        path: path.resolve(__dirname, './dist'),
    },

    // Target Runtime for live reloading
    target: 'web',

    // Sourcemap and Optimization
    devtool: build.sourceMap,
    optimization: {
        minimize: build.minimize,
        minimizer: ['...', new CssMinimizerPlugin()],
    },

    // Development Server
    devServer: {
        contentBase: path.join(__dirname, './dist'),
        port: 9090,
    },
    module: {
        rules: [
            // JavaScript
            {
                test: /\.js$/,
                exclude: /node_module/,
                use: 'babel-loader',
            },
            // Sass and Css
            {
                test: /\.(s?css)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '',
                        },
                    },
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            // Images and Fonts
            {
                test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: './assets',
                        name: '[name].[ext]',
                    },
                },
            },
        ],
    },

    // Plugins
    plugins: [
        // Clean Output Directory Before Rebuild
        new CleanWebpackPlugin(),
        // Html File Generate
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'bundle.css',
        }),
    ],
};
module.exports = webpackConfig;
