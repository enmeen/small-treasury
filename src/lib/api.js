// API服务 - 连接到json-server
import { getToken, isLoggedIn, saveAuth, clearAuth, getUsernameOnly, isFullyLoggedIn } from './auth.js';

// 在开发环境中，使用端口5174
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5174/api';

/**
 * 创建带认证头的请求选项
 * @param {Object} options 请求选项
 * @returns {Object} 带认证头的请求选项
 */
const createAuthOptions = (options = {}) => {
  const token = getToken();
  if (!token) return options;
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  
  return { ...options, headers };
};

/**
 * 创建简单认证请求选项（只用用户名）
 * @param {Object} options 请求选项
 * @returns {Object} 带简单认证头的请求选项
 */
const createSimpleAuthOptions = (options = {}) => {
  const username = getUsernameOnly();
  if (!username) return options;
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${username}`
  };
  
  return { ...options, headers };
};

/**
 * 用户登录
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Promise<Object>} 登录结果
 */
export const login = async (username, password) => {
  console.log(`尝试登录: 用户名=${username}, 密码长度=${password?.length}`);
  
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    console.log(`登录响应状态: ${response.status}`);
    const responseData = await response.json();
    console.log('登录响应数据:', responseData);
    
    if (!response.ok) {
      throw new Error(responseData.error || '登录失败');
    }
    
    // 保存认证信息
    saveAuth(responseData.token, responseData.user);
    console.log('登录成功，保存用户信息:', responseData.user);
    
    return responseData;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

/**
 * 用户注册
 * @param {string} username 用户名
 * @param {string} password 密码
 * @param {string} displayName 显示名称
 * @returns {Promise<Object>} 注册结果
 */
export const register = async (username, password, displayName) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, displayName })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '注册失败');
    }
    
    const data = await response.json();
    
    // 保存认证信息
    saveAuth(data.token, data.user);
    
    return data;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
};

/**
 * 用户登出
 */
export const logout = () => {
  clearAuth();
};

/**
 * 检查用户名是否存在（简化登录）
 * @param {string} username 用户名
 * @returns {Promise<Object>} 检查结果
 */
export const checkUsername = async (username) => {
  try {
    const response = await fetch(`${API_URL}/check-username`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '检查用户名失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('检查用户名失败:', error);
    throw error;
  }
};

/**
 * 获取储钱罐数据
 * @returns {Promise<Object>} 储钱罐数据
 */
export const getPiggyBankData = async () => {
  // 如果未登录，返回空数据
  if (!isLoggedIn()) {
    return {
      balance: 0,
      transactions: [],
      goals: []
    };
  }
  
  try {
    // 尝试使用完整认证
    let authOptions = isFullyLoggedIn() ? createAuthOptions() : createSimpleAuthOptions();
    
    const response = await fetch(`${API_URL}/piggyBank`, authOptions);
    
    if (!response.ok) {
      throw new Error('无法获取数据');
    }
    
    return await response.json();
  } catch (error) {
    console.error('获取数据失败:', error);
    // 如果API请求失败，使用本地存储作为备份
    alert('获取数据失败');
  }
};

/**
 * 保存储钱罐数据
 * @param {Object} data 储钱罐数据
 * @returns {Promise<Object>} 更新后的数据
 */
export const savePiggyBankData = async (data) => {
  // 如果未登录，仅保存到本地
  if (!isLoggedIn()) {
    return saveLocalPiggyBankData(data);
  }
  
  try {
    // 使用适合的认证方式
    const authHeader = isFullyLoggedIn() 
      ? `Bearer ${getToken()}` 
      : `Bearer ${getUsernameOnly()}`;
    
    const response = await fetch(`${API_URL}/piggyBank`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('保存数据失败');
    }
    
    const updatedData = await response.json();
    
    // 同时更新本地存储作为备份
    saveLocalPiggyBankData(updatedData);
    
    return updatedData;
  } catch (error) {
    console.error('保存数据失败:', error);
    // 如果API请求失败，使用本地存储作为备份
    return saveLocalPiggyBankData(data);
  }
};

// 实时计算余额 - 只计算已存储的交易
export const calculateBalance = (transactions) => {
  return transactions.reduce((sum, transaction) => {
    // 只有已存储的增加金额和所有减少金额才计入余额
    if (transaction.deposited || transaction.amount < 0) {
      return sum + transaction.amount;
    }
    return sum;
  }, 0);
};

// 添加交易
export const addTransaction = async (amount, description) => {
  // 获取当前数据
  const data = await getPiggyBankData();
  
  // 如果是减少金额，检查余额是否足够
  if (amount < 0) {
    // 计算当前实际余额
    const currentBalance = calculateBalance(data.transactions);
    
    // 如果扣除后余额为负，则拒绝交易
    if (currentBalance + amount < 0) {
      throw new Error(`余额不足！当前余额为 ¥${currentBalance.toFixed(2)}，无法取出 ¥${Math.abs(amount).toFixed(2)}`);
    }
  }
  
  // 添加交易记录
  const transaction = {
    id: Date.now(),
    amount,
    description,
    date: new Date().toISOString(),
    deposited: amount <= 0 // 如果是减少金额，默认为已存储状态
  };
  
  data.transactions.unshift(transaction);
  
  // 重新计算余额 - 只包括已存储的交易
  data.balance = calculateBalance(data.transactions);
  
  // 保存更新后的数据
  return await savePiggyBankData(data);
};

// 更新交易的存储状态
export const updateTransactionDepositStatus = async (transactionId) => {
  // 获取当前数据
  const data = await getPiggyBankData();
  
  const transaction = data.transactions.find(t => t.id === transactionId);
  if (transaction) {
    transaction.deposited = true;
    
    // 重新计算余额 - 只包括已存储的交易
    data.balance = calculateBalance(data.transactions);
    
    // 保存更新后的数据
    return await savePiggyBankData(data);
  }
  
  return data;
};

// 添加储蓄目标
export const addGoal = async (name, amount) => {
  // 获取当前数据
  const data = await getPiggyBankData();
  
  const goal = {
    id: Date.now(),
    name,
    amount: parseFloat(amount),
    currentAmount: 0,
    completed: false
  };
  
  data.goals.push(goal);
  
  // 保存更新后的数据
  return await savePiggyBankData(data);
};

// 标记目标为已完成
export const markGoalAsCompleted = async (goalId) => {
  // 获取当前数据
  const data = await getPiggyBankData();
  
  const goal = data.goals.find(g => g.id === goalId);
  if (goal) {
    // 检查余额是否足够
    const currentBalance = calculateBalance(data.transactions);
    if (currentBalance < goal.amount) {
      throw new Error(`余额不足！完成此目标需要 ¥${goal.amount.toFixed(2)}，但当前余额仅有 ¥${currentBalance.toFixed(2)}`);
    }
    
    // 添加一条扣款交易记录
    const transaction = {
      id: Date.now(),
      amount: -goal.amount, // 负值表示扣除金额
      description: `完成目标：${goal.name}`,
      date: new Date().toISOString(),
      deposited: true // 扣款交易默认为已存入状态
    };
    
    // 添加交易记录
    data.transactions.unshift(transaction);
    
    // 标记为已完成
    goal.completed = true;
    
    // 记录完成时间
    goal.completedAt = new Date().toISOString();
    
    // 记录此目标是否已删除（初始为false）
    if (goal.deleted === undefined) {
      goal.deleted = false;
    }
    
    // 重新计算余额
    data.balance = calculateBalance(data.transactions);
    
    // 保存更新后的数据
    return await savePiggyBankData(data);
  }
  
  return data;
};

// 删除目标
export const deleteGoal = async (goalId) => {
  // 获取当前数据
  const data = await getPiggyBankData();
  
  const goal = data.goals.find(g => g.id === goalId);
  if (goal) {
    // 如果已经完成的目标，只标记为删除而不实际从数组删除
    // 这样在家长管理页面仍然可以看到
    if (goal.completed) {
      goal.deleted = true;
    } else {
      // 如果没有完成，才真正从数组删除
      data.goals = data.goals.filter(g => g.id !== goalId);
    }
  } else {
    // 如果找不到目标，直接过滤掉
    data.goals = data.goals.filter(g => g.id !== goalId);
  }
  
  // 保存更新后的数据
  return await savePiggyBankData(data);
};

// 更新储蓄目标进度
export const updateGoal = async (goalId, amount) => {
  // 获取当前数据
  const data = await getPiggyBankData();
  
  const goal = data.goals.find(g => g.id === goalId);
  if (goal) {
    goal.currentAmount += amount;
    
    // 保存更新后的数据
    return await savePiggyBankData(data);
  }
  
  return data;
};

// ===== 本地存储备份方法 =====

// 从本地存储获取数据（作为备份）
const getLocalPiggyBankData = () => {
  const token = getToken();
  const key = token ? `piggyBank_${token}` : 'piggyBank';
  
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify({
      balance: 0,
      transactions: [],
      goals: []
    }));
  }
  
  return JSON.parse(localStorage.getItem(key));
};

// 保存数据到本地存储（作为备份）
const saveLocalPiggyBankData = (data) => {
  const token = getToken();
  const key = token ? `piggyBank_${token}` : 'piggyBank';
  
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}; 