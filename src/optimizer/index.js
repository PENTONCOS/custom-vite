import { scanImports } from './scan.js';

// 分析项目中的第三方依赖
async function createOptimizeDepsRun(config) {
	// 通过 scanImports 方法寻找项目中的所有需要预构建的模块
	const deps = await scanImports(config);
	console.log(deps, 'deps');
}

export { createOptimizeDepsRun };
