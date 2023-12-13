import serveStatic from 'serve-static';

// 保证对应目录下的静态资源可被访问
function staticMiddleware({ root }) {
	return serveStatic(root);
}

export default staticMiddleware;
