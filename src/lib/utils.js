/**
 * 格式化货币金额
 * @param {number} amount - 货币金额
 * @param {number} decimals - 小数位数
 * @returns {string} 格式化后的金额字符串
 */
export const formatCurrency = (amount, decimals = 2) => {
  return `¥${amount.toFixed(decimals)}`;
};

/**
 * 格式化日期时间
 * @param {string|Date} date - 日期对象或ISO格式日期字符串
 * @returns {string} 本地化格式的日期字符串
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString();
};

/**
 * 计算目标进度百分比
 * @param {number} current - 当前值
 * @param {number} target - 目标值
 * @returns {number} 百分比进度，最大100
 */
export const calculateProgress = (current, target) => {
  if (!target || target <= 0) return 0;
  return Math.min((current / target) * 100, 100);
};

/**
 * 根据进度百分比获取状态描述
 * @param {Object} goal - 目标对象
 * @param {number} progress - 进度百分比
 * @returns {string} 状态描述
 */
export const getGoalStatus = (goal, progress) => {
  if (goal?.completed) return '已完成';
  
  if (progress >= 100) return '已达成';
  if (progress >= 75) return '即将达成';
  if (progress >= 50) return '进行中';
  if (progress >= 25) return '努力存钱中';
  return '刚开始';
}; 