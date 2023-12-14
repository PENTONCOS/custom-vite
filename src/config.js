import path from 'path';
import resolve from 'resolve';
import { normalizePath } from './utils.js';

// 寻找所在项目目录
function findNearestPackageData(basedir) {
	// 原始启动目录
	const originalBasedir = basedir;
	const pckDir = path.dirname(resolve.sync(`${originalBasedir}/package.json`));
	return path.resolve(pckDir, 'node_modules', '.custom-vite');
}

// 加载 vite 配置文件
async function resolveConfig() {
	const config = {
		root: normalizePath(process.cwd()),
		cacheDir: findNearestPackageData(normalizePath(process.cwd())), // 增加一个 cacheDir 目录
		entryPoints: [path.resolve('index.html')]
	};
	return config;
}

export default resolveConfig;
