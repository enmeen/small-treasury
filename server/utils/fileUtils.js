import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 获取项目根目录
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..', '..');

/**
 * 读取用户数据
 * @returns {Object} 用户数据对象
 */
export const readUsersData = () => {
  const usersFilePath = join(ROOT_DIR, 'users.json');
  try {
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  } catch (error) {
    console.error('读取用户数据失败:', error);
    throw error;
  }
};

/**
 * 保存用户数据
 * @param {Object} usersData 用户数据对象
 */
export const saveUsersData = (usersData) => {
  const usersFilePath = join(ROOT_DIR, 'users.json');
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));
  } catch (error) {
    console.error('保存用户数据失败:', error);
    throw error;
  }
};

/**
 * 获取用户数据文件路径
 * @param {string} username 用户名
 * @returns {string} 文件路径
 */
export const getUserDbPath = (username) => {
  return join(ROOT_DIR, `db_${username}.json`);
};

export const isExistUserDbFile = (username) => {
  return fs.existsSync(getUserDbPath(username));
};

/**
 * 创建用户数据文件
 * @param {string} username 用户名
 */
export const createUserDbFile = (username) => {
  const dbTemplate = {
    piggyBank: {
      balance: 0,
      transactions: [],
      goals: []
    }
  };
  
  fs.writeFileSync(
    getUserDbPath(username),
    JSON.stringify(dbTemplate, null, 2)
  );
};

/**
 * 获取项目根目录
 * @returns {string} 根目录路径
 */
export const getRootDir = () => ROOT_DIR;

/**
 * 获取静态文件目录
 * @returns {string} 静态文件目录路径
 */
export const getStaticDir = () => join(ROOT_DIR, 'dist'); 