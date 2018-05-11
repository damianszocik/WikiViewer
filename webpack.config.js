const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: ["./src/script.js", "./src/style.css"],
    output: {
        path: `${__dirname}/dist`,
        filename: 'bundle.js'
    },
    watch: true,
    mode: "development",
    devtool: "source-map",
    module: {
        rules: [
            {   //babel, used to translate from ES6
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [["env", {
                            targets: {
                                browsers: ['> 1%']
                            }
                        }]]
                    }
                }
            },
            {   //autoprefixing css, and extracting it to bundle.css
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["postcss-loader"]
                })
            },
            {   //url-loader, used to load fonts in css
                test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
                loader: 'url-loader?limit=100000' 
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "bundle.css"
        })
    ]
}