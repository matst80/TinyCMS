var path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: './index.js',
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].index.js',
    libraryTarget: 'commonjs2' // THIS IS THE MOST IMPORTANT LINE! :mindblow: I wasted more than 2 days until realize this was the line most important in all this guide.
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname),
        exclude: /(node_modules|bower_components|build)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          "css-loader","sass-loader"
        ]
      },
    ]
  },
  externals: {
    'react-sortable-tree': 'react-sortable-tree',
    'react-sortable-hoc': 'react-sortable-hoc',
    'react-color': 'react-color',
    'react-dom': 'react-dom',
    'react': 'react' // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};