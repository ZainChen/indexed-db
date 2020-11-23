import path from 'path';
import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import WebpackBar from 'webpackbar';

/**
 * 编译渲染进程、生产环境、web端
 * 文件名的后缀名必须是'*.babel.js'
 */

module.exports = {
    mode: 'production',
    target: 'web',
    entry: {
        index: path.join(__dirname, '..', 'src/index.tsx')
    },
    output: {
        filename: './scripts/[name].js',
        chunkFilename: './scripts/chunk-filename/[name].js',
        path: path.resolve(__dirname, '..', 'out', 'www')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
            // 模块导入别名，指定后可以在文件之直接 import * from 'src/*';
            src: path.resolve(__dirname, '../src/'),
            // 模块导入别名，指定后可以在文件之直接 import * from 'assets/*';
            assets: path.resolve(__dirname, '../assets/')
        }
    },
    plugins: [
        // 可视化 webpack 输出文件的大小(体积分析)
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        }),
        /** 构建进度插件，（webpack 原装：new webpack.ProgressPlugin()） */
        new WebpackBar({
            name: 'zainote-prod-web-renderer',
            color: '#F50057'
        }),
        // 清空编译后的输出文件夹
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        // 拷贝所有窗口（BrowserWindow）的静态页面文件到输出文件夹，并添加 '<script src="./index.js"></script>'
        new HtmlWebpackPlugin({
            title: 'zainote',
            filename: 'index.html',
            template: path.join(__dirname, '..', 'src/page/index.html')
        }),
        new MiniCssExtractPlugin({
            filename: './style/[name].css'
        }),
        // 使 web 端能获取到环境变量（必须用'process.env.BUILD_ENV'获取，只用'process'获取不到，而且会报错）
        new webpack.DefinePlugin({
            'process.env.BUILD_ENV': JSON.stringify('production'),
            'process.env.HOT_ENV': JSON.stringify('false'),
            'process.env.PLAIN_HMR': JSON.stringify('false')
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node-modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    cacheCompression: false
                }
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node-modules/,
                use: {
                    // 触发根目录的 babel.config.js 文件中的 module.exports，将 ts|tsx 编译成通用 JavaScript 处理
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            /**
                             * [ext] {String} file.extname 资源扩展名
                             * [name] {String} file.basename 资源的基本名称
                             * [path] {String} file.dirname 资源相对于 context的路径
                             */
                            name: '[path][name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.ttf$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            outputPath: (url, resourcePath, context) => {
                                // console.log('zain>>>>>url,resourcePath', url, resourcePath, path.basename(url));
                                return `./assets/font/${path.basename(url)}`;
                            },
                            /** 设置文件输出目录、代码内生成的路径（相对 'out/client/renderer/page' 文件夹） */
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            publicPath: (url, resourcePath, context) => {
                                // console.log('zain>>>>>url,resourcePath', url, resourcePath, path.basename(url));
                                return `./assets/font/${path.basename(url)}`;
                            }
                        }
                    }
                ]
            }
        ]
    },
    // node: {
    //     __dirname: false,
    //     __filename: false,
    //     fs: 'empty'
    // }
};
