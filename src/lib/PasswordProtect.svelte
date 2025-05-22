<script>
  import { onMount } from 'svelte';
  import { getUsernameOnly, setParentAuth } from './auth.js';
  
  // 简易密码，实际应用中应使用更安全的认证方式
  const DEFAULT_PASSWORD = 'keep';
  
  // 认证状态
  export let authenticated = false;
  
  // 表单数据
  let username = getUsernameOnly() || '';
  let password = '';
  let error = '';
  
  // 登录函数
  const login = () => {
    if (!username.trim()) {
      error = '请输入用户名';
      return;
    }
    
    if (password === DEFAULT_PASSWORD) {
      error = '';
      authenticated = true;
      
      // 保存登录状态到session存储，这样刷新页面不会立即登出
      setParentAuth(true);
    } else {
      error = '密码错误，请重试';
      password = '';
    }
  };
  
  // 页面加载时检查登录状态
  onMount(() => {
    // 已保存用户名则自动填充
    username = getUsernameOnly() || '';
  });
</script>

<div class="password-protect">
  <div class="form-container">
    <h2>家长身份验证</h2>
    <p>请输入家长密码访问管理功能<br/><small>(这不是重新登录，而是额外的安全验证)</small></p>
    
    <form on:submit|preventDefault={login}>
      <div class="form-group">
        <label for="username">用户名:</label>
        <input 
          type="text" 
          id="username"
          placeholder="请输入用户名" 
          bind:value={username}
          autocomplete="username"
          disabled={!!getUsernameOnly()}
        />
      </div>
      
      <div class="form-group">
        <label for="password">家长密码:</label>
        <input 
          type="password" 
          id="password"
          placeholder="请输入家长密码" 
          bind:value={password}
          autocomplete="current-password"
        />
        <small class="help-text">默认家长密码为: keep</small>
      </div>
      
      {#if error}
        <div class="error">{error}</div>
      {/if}
      
      <button type="submit">验证</button>
    </form>
  </div>
</div>

<style>
  .password-protect {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    padding: 2rem;
  }
  
  .form-container {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 400px;
  }
  
  h2 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #333;
    text-align: center;
  }
  
  p {
    margin-bottom: 1.5rem;
    color: #666;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  input {
    width: 100%;
    padding: 0.7rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  input:focus {
    border-color: #4caf50;
    outline: none;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
  
  button {
    width: 100%;
    padding: 0.7rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #388e3c;
  }
  
  .error {
    background-color: #ffebee;
    color: #d32f2f;
    padding: 0.7rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .help-text {
    color: #666;
    font-size: 0.8rem;
    display: block;
    margin-top: 0.3rem;
  }
</style> 