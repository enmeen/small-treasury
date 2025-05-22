import jsonServer from 'json-server';
import { join } from 'path';

// 导入工具函数
import { getStaticDir, getRootDir } from './server/utils/fileUtils.js';

// 导入中间件
import { corsMiddleware, authMiddleware } from './server/middleware/auth.js';
import { spaMiddleware } from './server/middleware/spa.js';

// 导入路由处理
import { setupUserRoutes } from './server/routes/users.js';
import { setupDataRoutes } from './server/routes/data.js';

// 创建服务器实例
const server = jsonServer.create();

// 读取用户路由器
const usersRouter = jsonServer.router(join(getRootDir(), 'users.json'));

// 使用标准中间件
const middlewares = jsonServer.defaults({
  static: getStaticDir()
});

// 读取端口，默认8080
const port = process.env.PORT || 8080;
// 检查是否为开发环境
const isDev = port === 5174;

// 应用中间件
server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(corsMiddleware(isDev));
server.use(authMiddleware);

// 设置路由
setupUserRoutes(server);
setupDataRoutes(server, usersRouter);

// SPA前端路由处理
server.use(spaMiddleware);

// 启动服务器
server.listen(port, () => {
  console.log(`应用已启动，访问: http://localhost:${port}${isDev ? ' (开发模式)' : ''}`);
}); 