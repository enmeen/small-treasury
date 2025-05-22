<script>
  import { onMount } from 'svelte';
  
  // 简易密码，实际应用中应使用更安全的认证方式
  const DEFAULT_PASSWORD = 'keep';
  
  // 认证状态
  export let authenticated = false;
  
  // 表单数据
  let password = '';
  let error = '';
  
  // 登录函数
  const login = () => {
    if (password === DEFAULT_PASSWORD) {
      error = '';
      authenticated = true;
      
      // 保存登录状态到session存储，这样刷新页面不会立即登出
      sessionStorage.setItem('piggyBankAuth', 'true');
    } else {
      error = '密码错误，请重试';
      password = '';
    }
  };
  
  // 页面加载时检查登录状态
  onMount(() => {
    const auth = sessionStorage.getItem('piggyBankAuth');
    if (auth === 'true') {
      authenticated = true;
    }
  });
</script>

<div class="password-protect">
  <div class="form-container">
    <h2>家长管理区</h2>
    <p>请输入密码访问管理功能</p>
    
    <form on:submit|preventDefault={login}>
      <div class="form-group">
        <label for="password">密码:</label>
        <input 
          type="password" 
          id="password"
          placeholder="请输入密码" 
          bind:value={password}
          autocomplete="current-password"
        />
      </div>
      
      {#if error}
        <div class="error">{error}</div>
      {/if}
      
      <button type="submit">登录</button>
    </form>
    
    <!-- <div class="hint">
      <small>默认密码: 1234</small>
    </div> -->
  </div>
</div>

<style>
  .password-protect {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
  }
  
  .form-container {
    background: white;
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  p {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #666;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
  }
  
  button:hover {
    background-color: #3e8e41;
  }
  
  .error {
    background-color: #ffebee;
    color: #d32f2f;
    padding: 0.8rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .hint {
    margin-top: 1rem;
    text-align: center;
    color: #888;
  }
</style> 