import nodePath from 'path';
import fs from 'fs-extra';
import { createPluginContainer } from './pluginContainer.js';
import resolvePlugin from '../plugins/resolve.js';

const htmlTypesRe = /(\.html)$/;
const scriptModuleRe = /<script\s+type="module"\s+src\="(.+?)">/;

async function esbuildScanPlugin(config, depImports) {
	// vite 插件容器系统
	const container = await createPluginContainer({
		plugins: [resolvePlugin({ root: config.root })],
		root: config.root
	});

	const resolveId = async (path, importer) => {
		return await container.resolveId(path, importer);
	};

	return {
		name: 'ScanPlugin',
		setup(build) {
			// 引入时处理 HTML 入口文件
			build.onResolve({ filter: htmlTypesRe }, async ({ path, importer }) => {
				// 将传入的路径转化为绝对路径
				const resolved = await resolveId(path, importer);
				if (resolved) {
					return {
						path: resolved?.id || resolved,
						namespace: 'html'
					};
				}
			});

			// 额外增加一个 onResolve 方法来处理其他模块(非html，比如 js 引入)
			build.onResolve({ filter: /.*/ }, async ({ path, importer }) => {
				const resolved = await resolveId(path, importer);
				if (resolved) {
					const id = resolved.id || resolved;
					if (id.includes('node_modules')) {
						depImports[path] = id;
						return {
							path: id,
							external: true
						};
					}
					return {
						path: id
					};
				}
			});

			// 当加载命名空间为 html 的文件时
			build.onLoad({ filter: htmlTypesRe, namespace: 'html' }, async ({ path }) => {
				// 将 HTML 文件转化为 js 入口文件
				const htmlContent = fs.readFileSync(path, 'utf-8');
				console.log(htmlContent, 'htmlContent'); // htmlContent 为读取的 html 字符串
				const [, src] = htmlContent.match(scriptModuleRe);
				console.log('匹配到的 src 内容', src); // 获取匹配到的 src 路径：/main.js
				const jsContent = `import ${JSON.stringify(src)}`;
				return {
					contents: jsContent,
					loader: 'js'
				};
			});
		}
	};
}

export { esbuildScanPlugin };
