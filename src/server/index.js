import connect from 'connect';
import http from 'node:http';
import staticMiddleware from './middleware/staticMiddleware.js';
import resolveConfig from '../config.js';
import { createOptimizeDepsRun } from '../optimizer/index.js';

// 预构建
async function runOptimize(config) {
	await createOptimizeDepsRun(config);
}

// 创建开发服务器
async function createServer() {
	// 通过 connect 模块为 http 提供中间件扩展支持
	const app = connect();
	// 模拟 vite 配置项
	const config = await resolveConfig();
	// 使用静态资源中间件
	app.use(staticMiddleware(config));

	const server = {
		async listen(port, callback) {
			// 启动服务之前进行预构建
			await runOptimize(config);

			// 启动服务
			http.createServer(app).listen(port, callback);
		}
	};
	return server;
}

export { createServer };
