var webpack = require('webpack');
ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    // 页面入口文件配置
    entry : {
        'index': './client/index.js',
    },
    // 入口文件输出配置
    output : {
        path : __dirname + '/bundle/js/',
        filename : '[name].bundle.js'
    },
    module: {
        // 加载器配置
        loaders: [
        {
            test: /\.js$/,
            loaders: ['babel-loader']
        },
        {test: /\.(css|less)$/, loader: ExtractTextPlugin.extract(['css-loader', 'less-loader'])},
        {
            test: /\.js|jsx$/,
            loader: 'babel-loader',
            query: {presets: ['es2015','react','stage-0']}
        }
        ]
    },
    // 其他解决方案配置
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.json'],
    },
    // 插件项
    plugins : [
        //  额外添加一个打包文件
        new ExtractTextPlugin('[name].css'),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
        new webpack.DefinePlugin({
          "process.env": { 
             NODE_ENV: JSON.stringify("production") 
           }
        })
    ]
}