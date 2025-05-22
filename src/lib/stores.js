import { writable } from 'svelte/store';
import { getPiggyBankData, addTransaction, addGoal, updateGoal, updateTransactionDepositStatus, markGoalAsCompleted, deleteGoal } from './api.js';

// 默认初始数据
const defaultData = {
  balance: 0,
  transactions: [],
  goals: []
};

// 创建储钱罐状态
export const piggyBankStore = writable(defaultData);

// 刷新数据
export const refreshData = async () => {
  try {
    const data = await getPiggyBankData();
    piggyBankStore.set(data);
    return data;
  } catch (error) {
    console.error('刷新数据失败:', error);
  }
};

// 添加交易
export const addMoney = async (amount, description) => {
  if (!description.trim()) {
    throw new Error('描述不能为空');
  }
  
  try {
    const data = await addTransaction(parseFloat(amount), description);
    piggyBankStore.set(data);
    return data;
  } catch (error) {
    console.error('添加交易失败:', error);
    throw error;
  }
};

// 标记交易为已存储
export const markTransactionAsDeposited = async (transactionId) => {
  try {
    const data = await updateTransactionDepositStatus(transactionId);
    piggyBankStore.set(data);
    return data;
  } catch (error) {
    console.error('标记交易失败:', error);
    throw error;
  }
};

// 添加目标
export const createGoal = async (name, amount) => {
  try {
    const data = await addGoal(name, amount);
    piggyBankStore.set(data);
    return data;
  } catch (error) {
    console.error('添加目标失败:', error);
    throw error;
  }
};

// 完成目标
export const completeGoal = async (goalId) => {
  try {
    const data = await markGoalAsCompleted(goalId);
    piggyBankStore.set(data);
    return data;
  } catch (error) {
    console.error('完成目标失败:', error);
    throw error;
  }
};

// 删除目标
export const removeGoal = async (goalId) => {
  try {
    const data = await deleteGoal(goalId);
    piggyBankStore.set(data);
    return data;
  } catch (error) {
    console.error('删除目标失败:', error);
    throw error;
  }
};

// 更新目标
export const updateGoalProgress = async (goalId, amount) => {
  try {
    const data = await updateGoal(goalId, parseFloat(amount));
    piggyBankStore.set(data);
    return data;
  } catch (error) {
    console.error('更新目标进度失败:', error);
    throw error;
  }
}; 