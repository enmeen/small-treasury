import jsonServer from 'json-server';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: join(__dirname, 'dist')
});

// 读取端口，默认8080
const port = process.env.PORT || 8080;

// 使用json-server中间件
server.use(middlewares);

// 配置json-server的路由规则
server.use('/api', router);

// 前端路由处理 - 将非API请求重定向到index.html
server.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    const indexHtml = join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexHtml)) {
      res.sendFile(indexHtml);
      return;
    }
  }
  next();
});

// 启动服务器
server.listen(port, () => {
  console.log(`应用已启动，访问: http://localhost:${port}`);
}); 