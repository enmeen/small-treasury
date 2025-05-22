// 认证相关存储键
export const AUTH_TOKEN_KEY = 'piggyBankAuthToken';
export const USER_INFO_KEY = 'piggyBankUserInfo';
export const USERNAME_ONLY_KEY = 'piggyBankUsername';
export const PARENT_AUTH_KEY = 'piggyBankParentAuth';

/**
 * 保存认证信息到本地存储
 * @param {string} token 用户令牌
 * @param {Object} userInfo 用户信息
 */
export const saveAuth = (token, userInfo) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  localStorage.setItem(USERNAME_ONLY_KEY, userInfo.username);
};

/**
 * 保存简单用户名登录（不需要密码）
 * @param {string} username 用户名
 */
export const saveUsernameOnly = (username) => {
  localStorage.setItem(USERNAME_ONLY_KEY, username);
};

/**
 * 获取简单用户名
 * @returns {string|null} 用户名
 */
export const getUsernameOnly = () => {
  return localStorage.getItem(USERNAME_ONLY_KEY);
};

/**
 * 设置家长认证状态
 * @param {boolean} isAuthenticated 是否通过家长认证
 */
export const setParentAuth = (isAuthenticated) => {
  if (isAuthenticated) {
    sessionStorage.setItem(PARENT_AUTH_KEY, 'true');
  } else {
    sessionStorage.removeItem(PARENT_AUTH_KEY);
  }
};

/**
 * 检查是否通过家长认证
 * @returns {boolean} 是否通过家长认证
 */
export const isParentAuth = () => {
  return sessionStorage.getItem(PARENT_AUTH_KEY) === 'true';
};

/**
 * 获取认证令牌
 * @returns {string|null} 认证令牌
 */
export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * 获取当前用户信息
 * @returns {Object|null} 用户信息
 */
export const getCurrentUser = () => {
  const userInfo = localStorage.getItem(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * 检查用户是否已完全登录（用户名和密码）
 * @returns {boolean} 是否已完全登录
 */
export const isFullyLoggedIn = () => {
  return !!getToken();
};

/**
 * 检查用户是否已简单登录（仅用户名）
 * @returns {boolean} 是否已简单登录
 */
export const isSimpleLoggedIn = () => {
  return !!getUsernameOnly();
};

/**
 * 检查用户是否已登录（任意方式）
 * @returns {boolean} 是否已登录
 */
export const isLoggedIn = () => {
  return isFullyLoggedIn() || isSimpleLoggedIn();
};

/**
 * 清除认证信息（登出）
 * @param {boolean} fullLogout 是否完全登出，默认为true
 */
export const clearAuth = (fullLogout = true) => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
  sessionStorage.removeItem(PARENT_AUTH_KEY);
  
  if (fullLogout) {
    localStorage.removeItem(USERNAME_ONLY_KEY);
  }
}; 