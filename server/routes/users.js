import { readUsersData, saveUsersData, createUserDbFile, isExistUserDbFile } from '../utils/fileUtils.js';
/**
 * 配置用户相关路由
 * @param {Object} server Express服务器实例
 */
export const setupUserRoutes = (server) => {
  // 登录API
  server.post('/api/login', handleLogin);

  // 注册API
  server.post('/api/register', handleRegister);

  // 检查用户名是否存在API
  server.post('/api/check-username', handleCheckUsername);
};

/**
 * 处理用户登录请求
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
const handleLogin = (req, res) => {
  console.log('收到登录请求, 请求体:', req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    console.log('登录失败: 用户名或密码为空');
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  try {
    const users = readUsersData().users;
    console.log(`查找用户 "${username}"`);

    const user = users.find(u => u.username === username);

    if (!user) {
      console.log(`登录失败: 用户 "${username}" 不存在`);
      return res.status(401).json({ error: '用户名或密码不正确' });
    }

    console.log(`检查密码: 输入密码长度=${password.length}, 存储密码长度=${user.password.length}`);

    // 检查文件是否存在
    if (!isExistUserDbFile(username)) {
      return res.status(401).json({ error: '用户数据不存在' });
    }

    if (user.password === password) {
      // 返回不包含密码的用户信息
      const { password, ...userInfo } = user;
      console.log('登录成功:', userInfo);

      return res.json({
        success: true,
        user: userInfo,
        token: username // 简单实现，使用用户名作为token
      });
    } else {
      console.log('登录失败: 密码不匹配');
      return res.status(401).json({ error: '用户名或密码不正确' });
    }
  } catch (error) {
    console.error('登录错误:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
};

/**
 * 处理用户注册请求
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
const handleRegister = (req, res) => {
  const { username, password, displayName } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  try {
    // 读取现有用户
    const usersData = readUsersData();
    const users = usersData.users;

    // 检查用户名是否已存在
    if (users.some(u => u.username === username)) {
      return res.status(400).json({ error: '用户名已存在' });
    }

    // 添加新用户
    const newUser = {
      username,
      password,
      displayName: displayName || username,
      createdAt: new Date().toISOString()
    };

    usersData.users.push(newUser);

    // 保存更新后的用户数据
    saveUsersData(usersData);

    // 为新用户创建数据文件
    createUserDbFile(username);

    // 返回成功响应（不包含密码）
    const { password: _, ...userInfo } = newUser;
    return res.status(201).json({
      success: true,
      user: userInfo,
      token: username // 简单实现，使用用户名作为token
    });
  } catch (error) {
    console.error('注册错误:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
};

/**
 * 处理检查用户名请求
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 */
const handleCheckUsername = (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: '用户名不能为空' });
  }

  try {
    const users = readUsersData().users;
    const user = users.find(u => u.username === username);

    if (user) {
      // 返回不包含密码的用户信息
      const { password, ...userInfo } = user;
      console.log('handleCheckUsername', userInfo);
      if (!isExistUserDbFile(username)) {
        return res.status(401).json({ error: '用户数据不存在' });
      }
      return res.json({
        success: true,
        user: userInfo,
        exists: true
      });
    } else {
      return res.json({ success: false, exists: false });
    }
  } catch (error) {
    console.error('检查用户名错误:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
}; 