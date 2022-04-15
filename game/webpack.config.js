const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    
    // production mode
    mode: 'development',
    
    // input file
    entry: './game.js',
    
    // output file
    output: {
        
        // file name
        filename: 'bundle.js',
        
        // complete path
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['dist']
        }),
        new HtmlWebpackPlugin()
    ],
    module: {
        rules: [{
            test: /\.(png|jpg|gif)$/,
            use: {
                loader: 'file-loader',
                options: {
                    outputPath: 'assets'
                }
            }
        }]
    },
    devServer: {
        static: './'
    }
}
