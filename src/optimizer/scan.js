import { build } from 'esbuild';
import { esbuildScanPlugin } from './scanPlugin.js';

// 分析项目中的 import 引入
async function scanImports(config) {
	// 保存扫描到的依赖
	const depImports = {};
	// 创建 Esbuild 扫描插件
	const scanPlugin = await esbuildScanPlugin();

	// 借助 EsBuild 进行依赖预构建
	await build({
		absWorkingDir: config.root, // esbuild 当前工作目录
		entryPoints: config.entryPoints, // 入口文件
		bundle: true, // 是否需要打包第三方依赖，默认 Esbuild 并不会，这里我们声明为 true 表示需要
		format: 'esm', // 打包后的格式为 esm
		write: false, // 不需要将打包的结果写入硬盘中
		plugins: [scanPlugin] // 自定义的 scan 插件
	});

	return depImports;
}

export { scanImports };
