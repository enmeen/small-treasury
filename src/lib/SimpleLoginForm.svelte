<script>
  import { createEventDispatcher } from 'svelte';
  import { checkUsername } from './api.js';
  import { saveUsernameOnly } from './auth.js';
  
  // 事件分发器
  const dispatch = createEventDispatcher();
  
  // 表单状态
  export let savedUsername = '';
  let username = savedUsername || '';
  let isLoading = false;
  let error = '';
  
  // 处理表单提交
  const handleSubmit = async () => {
    error = '';
    
    // 表单验证
    if (!username.trim()) {
      error = '请输入用户名';
      return;
    }
    
    try {
      isLoading = true;
      
      // 检查用户名是否存在
      const result = await checkUsername(username);
      
      if (result.exists) {
        // 保存用户名到本地存储
        saveUsernameOnly(username);
        
        // 通知父组件登录成功
        dispatch('success', { username });
      } else {
        error = '用户不存在，请检查用户名或注册';
      }
    } catch (err) {
      console.error('检查用户名失败:', err);
      error = err.message || '登录失败，请稍后重试';
    } finally {
      isLoading = false;
    }
  };
  
  // 返回选择页面
  const goBack = () => {
    dispatch('back');
  };
</script>

<div class="simple-login-container">
  <h2>宝宝登录</h2>
  <p>输入用户名开始使用储钱罐</p>
  
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="username">用户名</label>
      <input 
        type="text" 
        id="username" 
        bind:value={username} 
        placeholder="请输入用户名"
        disabled={isLoading}
        autocomplete="username"
      />
    </div>
    
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
    
    <button type="submit" class="btn btn-primary" disabled={isLoading}>
      {isLoading ? '正在验证...' : '开始使用'}
    </button>
    
    <div class="login-option">
      <button type="button" class="link-button back-button" on:click={goBack}>
        返回选择
      </button>
    </div>
  </form>
</div>

<style>
  .simple-login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 0.5rem;
    color: #333;
    font-size: 1.5rem;
  }
  
  p {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #666;
  }
  
  .login-option {
    margin-top: 1rem;
    text-align: center;
  }
  
  .link-button {
    background: none;
    border: none;
    color: #4caf50;
    cursor: pointer;
    font-weight: 600;
    text-decoration: underline;
    padding: 0;
    margin: 0;
  }
  
  .link-button:hover {
    color: #3e8e41;
  }
  
  .back-button {
    color: #999;
  }
  
  .back-button:hover {
    color: #666;
  }
</style> 