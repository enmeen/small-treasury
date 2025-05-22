import { readUsersData } from '../utils/fileUtils.js';

/**
 * 认证中间件 - 验证用户请求
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @param {Function} next 下一个中间件
 */
export const authMiddleware = (req, res, next) => {
  // 检查原始URL
  const fullPath = req.originalUrl || req.url;
  
  // 跳过登录、注册、检查用户名和静态资源请求的认证
  if (fullPath.includes('/api/login') || 
      fullPath.includes('/api/register') || 
      fullPath.includes('/api/check-username') ||
      !fullPath.includes('/api')) {
    return next();
  }
  
  // 检查认证头
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未授权访问' });
  }
  
  // 获取用户名
  const username = authHeader.split(' ')[1];
  
  // 检查用户是否存在
  try {
    const users = readUsersData().users;
    const userExists = users.some(user => user.username === username);
    
    if (!userExists) {
      return res.status(401).json({ error: '用户不存在' });
    }
    
    // 将用户名保存到请求对象中，供后续中间件使用
    req.username = username;
    next();
  } catch (error) {
    console.error('认证错误:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
};

/**
 * CORS中间件 - 处理跨域请求
 * @param {boolean} isDev 是否为开发环境
 * @returns {Function} 中间件函数
 */
export const corsMiddleware = (isDev) => (req, res, next) => {
  // 在开发环境下，允许来自前端服务器的请求
  if (isDev) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
  }
  next();
}; 