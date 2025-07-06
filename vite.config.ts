import react from '@vitejs/plugin-react-swc';
import autoprefixer from 'autoprefixer';
import { writeFile, readFile, readdir, stat, access } from 'fs/promises';
import { resolve, join, extname } from 'path';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';
import JScrewIt from 'jscrewit';

const convertString2Unicode = (s: string): string => {
	return s
		.split('')
		.map((char) => {
			const hexVal = char.charCodeAt(0).toString(16);
			return '\\u' + ('000' + hexVal).slice(-4);
		})
		.join('');
};

const processFile = async (filePath: string): Promise<void> => {
	try {
		const data = await readFile(filePath, 'utf8');
		const isHtmlFile = extname(filePath).toLowerCase() === '.html';
		const TMPL = `document.write('__UNI__')`;
		const jsString = isHtmlFile
			? TMPL.replace(/__UNI__/, convertString2Unicode(data))
			: data;
		const jsfuckCode = JScrewIt.encode(jsString);

		const finalContent = isHtmlFile
			? `<script type="text/javascript">${jsfuckCode}</script>`
			: jsfuckCode;

		await writeFile(filePath, finalContent);
		console.log(`✅ Encoded: ${filePath}`);
	} catch (error) {
		console.error(`❌ Failed to process ${filePath}:`, error);
		throw error;
	}
};

const walkDir = async (dir: string): Promise<void> => {
	try {
		const files = await readdir(dir);
		const processPromises: Promise<void>[] = [];

		for (const file of files) {
			const filePath = join(dir, file);
			const fileStat = await stat(filePath);

			if (fileStat.isDirectory()) {
				console.log(`📁 Entering directory: ${filePath}`);
				processPromises.push(walkDir(filePath));
			} else if (/\.(js|html)$/i.test(file)) {
				processPromises.push(processFile(filePath));
			}
		}

		await Promise.all(processPromises);
	} catch (error) {
		console.error(`❌ Error processing directory ${dir}:`, error);
		throw error;
	}
};

export default defineConfig({
	plugins: [
		react(),
		{
			name: 'create-redirects',
			apply: 'build',
			closeBundle: async () => {
				const filePath = resolve(__dirname, 'dist', '_redirects');
				const content = '/*    /index.html    200';
				try {
					await writeFile(filePath, content);
				} catch (err) {
					console.error(err);
				}
			},
		},
		{
			name: 'jscrewit-encoder',
			apply: 'build',
			closeBundle: async () => {
				try {
					console.log('🚀 Starting JScrewIt encoding process...');
					const distPath = resolve(__dirname, 'dist');

					try {
						await access(distPath);
					} catch {
						console.error('❌ Error: dist directory not found');
						return;
					}

					await walkDir(distPath);
					console.log(
						'✨ Successfully encoded all JS and HTML files in dist directory',
					);
				} catch (err) {
					console.error('❌ Fatal error during encoding:', err);
				}
			},
		},
	],
	build: {
		emptyOutDir: true,
	},
	server: {
		host: '0.0.0.0',
	},
	resolve: {
		alias: [
			{
				find: '@components',
				replacement: resolve(__dirname, 'src/components'),
			},
			{
				find: '@pages',
				replacement: resolve(__dirname, 'src/pages'),
			},
			{ find: '@utils', replacement: resolve(__dirname, 'src/utils') },
			{
				find: '@assets',
				replacement: resolve(__dirname, 'src/assets'),
			},
			{
				find: '@public',
				replacement: resolve(__dirname, 'public'),
			},
			{
				find: '@hooks',
				replacement: resolve(__dirname, 'src/hooks'),
			},
			{
				find: '@layouts',
				replacement: resolve(__dirname, 'src/layouts'),
			},
		],
	},
	css: {
		postcss: {
			plugins: [tailwindcss, autoprefixer],
		},
	},
});
