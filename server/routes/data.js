import jsonServer from 'json-server';
import { getUserDbPath, isExistUserDbFile } from '../utils/fileUtils.js';

/**
 * 配置用户数据相关路由
 * @param {Object} server Express服务器实例
 * @param {Object} usersRouter 用户路由器
 */
export const setupDataRoutes = (server, usersRouter) => {
  // 用户数据API - 动态加载用户数据文件
  server.use('/api', handleUserData(usersRouter));
};

/**
 * 处理用户数据路由
 * @param {Object} usersRouter 用户路由器
 * @returns {Function} 中间件函数
 */
const handleUserData = (usersRouter) => (req, res, next) => {
  if (req.path.startsWith('/piggyBank')) {
    // 获取用户名（从认证中间件中）
    const username = req.username;
    
    if (!username) {
      return res.status(401).json({ error: '未授权访问' });
    }
    
    // 构建用户数据文件路径
    const userDbPath = getUserDbPath(username);
    console.log('userDbPath', userDbPath);
    // 检查文件是否存在
    if (!isExistUserDbFile(username)) {
      return res.status(404).json({ error: '用户数据不存在' });
    }
    
    // 为此请求创建专门的路由器
    const userRouter = jsonServer.router(userDbPath);
    
    // 使用该路由器处理请求
    return userRouter(req, res, next);
  }
  
  // 其他API请求交给默认的用户路由器处理
  return usersRouter(req, res, next);
}; 