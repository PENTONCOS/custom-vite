import { normalizePath } from './utils.js';

// 加载 vite 配置文件
async function resolveConfig() {
	const config = {
		root: normalizePath(process.cwd()) // 仅定义一个项目根目录的返回
	};
	return config;
}

export default resolveConfig;
