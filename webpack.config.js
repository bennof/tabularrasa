const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const Components = [
	"components/menu.html",
	"components/sidebar.html"
];

function gen_components(){
	return Components.map(Value => {
		return new HtmlWebPackPlugin({
			filename: Value,
			template: './src/'+Value,
			inject: false
		});
	});
};


function gen_txt_files(Path,Input,Filter){
	var Out = new Array();
	fs.readdirSync(Path + Input).forEach(File => {
		if (fs.statSync(Path + Input + '/' + File).isDirectory()) {
      Out = Out.concat(gen_txt_files(Path, Input + '/' + File ));
    } else {
			if (Filter){
				if(Filter.test(File)){
					Out.push({from: Path + Input + '/'+ File, to: '.'+Input + '/'+File});
				}
			}else{
      	Out.push({from: Path + Input + '/'+ File, to: '.'+Input + '/'+File});
			}
    }
	});
	return Out;
};


const Rules = {
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
			test: /\.(html|htm|hbs)$/,
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
};

module.exports = [
	{
		name: 'default',
		mode: 'development',
		entry: ['./src/index.js'],
  	devtool: 'source-map',
		output: {
			filename: 'js/tabularrasa.js',
			path: path.resolve(__dirname, '.'),
			library: 'tr',
			libraryTarget:'umd',
			globalObject: 'this'
		},
  	module: Rules,
  	plugins:
			gen_components().concat([
    		new HtmlWebPackPlugin({ template: "./src/index.html", filename: "index.html", inject: "head" }),
    		new MiniCssExtractPlugin({ filename: "css/[name].css", chunkFilename: "[id].css" }),
				new FaviconsWebpackPlugin({ logo: "./src/img/edologo_s.svg", cache: true })
  		])
	},
	{
		name: 'ghost',
		mode: 'development',
		entry: ['./src/index.js'],
  	devtool: 'source-map',
		output: {
			filename: 'assets/js/tabularrasa.js',
			path: path.resolve(__dirname, '.'),
			library: 'tr',
			libraryTarget:'umd',
			globalObject: 'this'
		},
  	module: Rules,
  	plugins: [
			new MiniCssExtractPlugin({ filename: "assets/css/[name].css", chunkFilename: "[id].css" }),
			new CopyPlugin(gen_txt_files('./src/ghost','',/\.hbs$/)),
			new FaviconsWebpackPlugin({ logo: "./src/img/edologo_s.svg", cache: true })
		]
	}
]
