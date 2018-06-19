import { uglify } from 'rollup-plugin-uglify';

const plugins = [];
const dev = process.env.myenv === 'dev';
const prod = !dev;

if (prod) {
	plugins.push(uglify());
}

export default {
	input: 'src/index.js',
	output: {
		file: dev ? 'dist/easycolor.js' : 'dist/easycolor.min.js',
		format: 'iife'
	},
	plugins
};
