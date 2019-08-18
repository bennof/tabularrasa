const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	mode: 'development',
	entry: ['./src/index.js'],
  devtool: 'source-map',

	output: {
		filename: 'js/tabularrasa.js',
		path: path.resolve(__dirname, 'example'),
		library: 'tr',
	  libraryTarget:'umd',
		globalObject: 'this'
	},

  module: {
    rules:[
      { // Sass
        test: /\.(sa|sc|c)ss$/,
        use: [
          {loader: MiniCssExtractPlugin.loader},
          {loader: "css-loader"},
          {loader: "sass-loader", options: { implementation: require("sass") }}
        ]
      },
      { // Html
				test: /\.(html|htm)$/,
				use: [{ loader: 'html-loader'}]
			},
      { // Images
    		test: /\.(png|jpe?g|gif|svg)$/,
      	use: [{ loader: "file-loader", options: { outputPath: 'images' }}]
      },
  		{ // Fonts
  			test: /\.(woff|woff2|ttf|otf|eot)$/,
				use: [{ loader: "file-loader", options: { outputPath: 'fonts' }}]
      }
    ]
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "[id].css",
    })
  ]
}
