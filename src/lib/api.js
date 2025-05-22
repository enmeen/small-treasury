// API服务 - 连接到json-server
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001';

/**
 * 获取储钱罐数据
 * @returns {Promise<Object>} 储钱罐数据
 */
export const getPiggyBankData = async () => {
  try {
    const response = await fetch(`${API_URL}/piggyBank`);
    if (!response.ok) {
      throw new Error('无法获取数据');
    }
    return await response.json();
  } catch (error) {
    console.error('获取数据失败:', error);
    // 如果API请求失败，使用本地存储作为备份
    return getLocalPiggyBankData();
  }
};

/**
 * 保存储钱罐数据
 * @param {Object} data 储钱罐数据
 * @returns {Promise<Object>} 更新后的数据
 */
export const savePiggyBankData = async (data) => {
  try {
    const response = await fetch(`${API_URL}/piggyBank`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('保存数据失败');
    }
    
    return await response.json();
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
    // 标记为已完成
    goal.completed = true;
    
    // 记录完成时间
    goal.completedAt = new Date().toISOString();
    
    // 记录此目标是否已删除（初始为false）
    if (goal.deleted === undefined) {
      goal.deleted = false;
    }
    
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
  if (!localStorage.getItem('piggyBank')) {
    localStorage.setItem('piggyBank', JSON.stringify({
      balance: 0,
      transactions: [],
      goals: []
    }));
  }
  return JSON.parse(localStorage.getItem('piggyBank'));
};

// 保存数据到本地存储（作为备份）
const saveLocalPiggyBankData = (data) => {
  localStorage.setItem('piggyBank', JSON.stringify(data));
  return data;
}; 