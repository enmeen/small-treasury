import fs from 'fs';
import { join } from 'path';
import { getStaticDir } from '../utils/fileUtils.js';

/**
 * SPA前端路由处理 - 将非API请求重定向到index.html
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Function} next 下一个中间件
 */
export const spaMiddleware = (req, res, next) => {
  if (!req.path.startsWith('/api')) {
    const indexHtml = join(getStaticDir(), 'index.html');
    if (fs.existsSync(indexHtml)) {
      res.sendFile(indexHtml);
      return;
    }
  }
  next();
}; 