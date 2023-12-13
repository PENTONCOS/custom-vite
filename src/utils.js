// windows 下路径适配（将 windows 下路径的 // 变为 /）
function normalizePath(path) {
	return path.replace(/\\/g, '/');
}

export { normalizePath };
