<script>
  import { createEventDispatcher } from 'svelte';
  import { login, register } from './api.js';
  import { getCurrentUser, getUsernameOnly } from './auth.js';
  import SimpleLoginForm from './SimpleLoginForm.svelte';
  
  // 事件分发器
  const dispatch = createEventDispatcher();
  
  // 登录模式：simple=简化登录，login=完整登录，register=注册
  export let mode = 'simple';
  
  // 表单状态
  let isLoginMode = true;
  let username = getUsernameOnly() || '';
  let password = '';
  let displayName = '';
  let isLoading = false;
  let error = '';
  
  // 切换登录/注册模式
  const toggleMode = () => {
    isLoginMode = !isLoginMode;
    error = '';
  };
  
  // 切换到高级模式（登录/注册）
  const switchToAdvancedMode = () => {
    dispatch('mode-change', { mode: 'login' });
  };
  
  // 返回到选择器
  const goBackToSelector = () => {
    dispatch('mode-change', { mode: 'selector' });
  };
  
  // 处理简化登录成功
  const handleSimpleSuccess = (event) => {
    dispatch('success', { username: event.detail.username, simpleLogin: true });
  };
  
  // 处理表单提交
  const handleSubmit = async () => {
    error = '';
    console.log('准备提交登录表单', { username, password, isLoginMode });
    
    // 表单验证
    if (!username.trim()) {
      error = '请输入用户名';
      return;
    }
    
    if (!password.trim()) {
      error = '请输入密码';
      return;
    }
    
    if (!isLoginMode && !displayName.trim()) {
      error = '请输入显示名称';
      return;
    }
    
    try {
      isLoading = true;
      
      if (isLoginMode) {
        // 登录
        console.log('开始登录流程...');
        const result = await login(username, password);
        console.log('登录响应:', result);
      } else {
        // 注册
        console.log('开始注册流程...');
        await register(username, password, displayName);
      }
      
      // 获取登录后的用户信息
      const user = getCurrentUser();
      console.log('获取当前用户信息:', user);
      
      // 通知父组件登录成功
      dispatch('success', { user, simpleLogin: false });
    } catch (err) {
      console.error('登录/注册失败:', err);
      error = err.message || (isLoginMode ? '登录失败，请检查用户名和密码' : '注册失败');
    } finally {
      isLoading = false;
    }
  };
</script>

{#if mode === 'simple'}
  <div class="auth-container simple">
    <div class="auth-card">
      <h2>欢迎使用小猪储钱罐</h2>
      <p>请输入用户名开始使用</p>
      
      <SimpleLoginForm 
        savedUsername={username}
        on:success={handleSimpleSuccess}
        on:switch-mode={switchToAdvancedMode}
        on:back={goBackToSelector}
      />
    </div>
  </div>
{:else}
  <div class="auth-container">
    <div class="auth-card">
      <h2>{isLoginMode ? '家长登录' : '注册账号'}</h2>
      <p>{isLoginMode ? '输入用户名和密码' : '创建新账号'}</p>
      
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
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            bind:value={password} 
            placeholder="请输入密码"
            disabled={isLoading}
            autocomplete={isLoginMode ? "current-password" : "new-password"}
          />
        </div>
        
        {#if !isLoginMode}
          <div class="form-group">
            <label for="displayName">显示名称</label>
            <input 
              type="text" 
              id="displayName" 
              bind:value={displayName} 
              placeholder="请输入显示名称"
              disabled={isLoading}
            />
            <small>这是其他人看到的名称</small>
          </div>
        {/if}
        
        {#if error}
          <div class="error-message">{error}</div>
        {/if}
        
        <button type="submit" class="btn btn-primary" disabled={isLoading}>
          {isLoading ? '处理中...' : (isLoginMode ? '登录' : '注册')}
        </button>
        
        <div class="toggle-mode">
          <span>
            {isLoginMode ? '还没有账号？' : '已有账号？'}
          </span>
          <button type="button" on:click={toggleMode} class="link-button" disabled={isLoading}>
            {isLoginMode ? '立即注册' : '立即登录'}
          </button>
        </div>
        
        <div class="toggle-mode">
          <button type="button" on:click={goBackToSelector} class="link-button back-button" disabled={isLoading}>
            返回选择
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem 1rem;
  }
  
  .auth-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 1rem;
    color: #333;
  }
  
  p {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #666;
  }
  
  .toggle-mode {
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
  
  .link-button:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
  
  .simple .auth-card {
    text-align: center;
  }
  
  .back-button {
    color: #999;
  }
  
  .back-button:hover {
    color: #666;
  }
</style> 