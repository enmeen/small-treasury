<script>
  import { onMount } from 'svelte';
  import PiggyBank from './lib/PiggyBank.svelte';
  import AdminPanel from './lib/AdminPanel.svelte';
  import PasswordProtect from './lib/PasswordProtect.svelte';
  import LoginRegister from './lib/LoginRegister.svelte';
  import LoginSelector from './lib/LoginSelector.svelte';
  import { refreshData } from './lib/stores.js';
  import { isFullyLoggedIn, isSimpleLoggedIn, getCurrentUser, getUsernameOnly, isParentAuth, clearAuth, setParentAuth } from './lib/auth.js';
  import { logout } from './lib/api.js';

  // 当前页面
  let currentPage = 'home';
  // 认证状态
  let isAuthenticated = false;
  // 家长认证状态
  let isParentAuthenticated = false;
  // 登录模式: simple, login, register
  let loginMode = 'selector'; // 初始为选择器模式
  // 加载状态
  let isLoading = true;
  // 用户信息
  let currentUser = null;
  // 用户名
  let currentUsername = '';
  
  // 切换页面
  const navigateTo = (page) => {
    // 如果切换到家长管理，并且未通过家长认证和非完整登录
    if (page === 'admin' && !isParentAuthenticated && !isFullyLoggedIn()) {
      // 确保先有用户名登录
      if (!isSimpleLoggedIn() && !isFullyLoggedIn()) {
        alert('请先输入用户名');
        navigateTo('login');
        return;
      }
    }
    
    currentPage = page;
  };
  
  // 处理登出
  const handleLogout = (fullLogout = true) => {
    // 登出API和清除本地认证信息
    if (fullLogout) {
      logout();
      clearAuth(true);
      // 重置状态
      isAuthenticated = false;
      isParentAuthenticated = false;
      currentUser = null;
      currentUsername = '';
      loginMode = 'selector'; // 重置回选择器模式
    } else {
      // 仅清除家长认证
      setParentAuth(false);
      isParentAuthenticated = false;
    }
    
    // 导航到首页
    navigateTo('home');
  };
  
  // 处理登录成功
  const handleLoginSuccess = (event) => {
    if (event.detail.simpleLogin) {
      // 简化登录，只有用户名
      currentUsername = event.detail.username;
      isAuthenticated = true;
    } else {
      // 完整登录
      currentUser = event.detail.user;
      currentUsername = currentUser.username;
      isAuthenticated = true;
      isParentAuthenticated = true;
    }
    
    // 刷新数据
    refreshData();
    // 导航到首页
    navigateTo('home');
  };
  
  // 处理登录模式变更
  const handleLoginModeChange = (event) => {
    loginMode = event.detail.mode;
  };
  
  // 处理身份选择
  const handleRoleSelect = (event) => {
    const role = event.detail.role;
    if (role === 'kid') {
      loginMode = 'simple'; // 选择简化登录模式（只有用户名）
    } else if (role === 'parent') {
      loginMode = 'login'; // 选择完整登录模式（用户名+密码）
    }
  };
  
  // 跳转到登录页面
  const goToLogin = () => {
    loginMode = 'selector'; // 确保显示选择器
    navigateTo('login');
  };
  
  // 处理家长认证成功
  const handleParentAuth = (authenticated) => {
    isParentAuthenticated = authenticated;
  };

  // 初始化数据
  onMount(async () => {
    isLoading = true;
    
    try {
      // 检查登录状态
      if (isFullyLoggedIn()) {
        currentUser = getCurrentUser();
        currentUsername = currentUser.username;
        isAuthenticated = true;
        isParentAuthenticated = true; // 完整登录后自动具有家长权限
        loginMode = 'login'; // 已完整登录
      } else if (isSimpleLoggedIn()) {
        currentUsername = getUsernameOnly();
        isAuthenticated = true;
        loginMode = 'simple'; // 已简单登录
      } else {
        loginMode = 'selector'; // 未登录，显示选择器
      }
      
      // 异步加载数据
      await refreshData();
      
      // 检查URL参数是否有页面指定
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get('page');
      if (page === 'admin') {
        currentPage = 'admin';
      } else if (page === 'login') {
        currentPage = 'login';
      }
      
      // 添加页面变化监听
      window.addEventListener('popstate', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page');
        if (page === 'admin') {
          currentPage = 'admin';
        } else if (page === 'login') {
          currentPage = 'login';
        } else {
          currentPage = 'home';
        }
      });
    } catch (error) {
      console.error('初始化失败:', error);
    } finally {
      isLoading = false;
    }
  });

  // 当页面改变时更新URL
  $: {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (currentPage === 'home') {
        url.searchParams.delete('page');
      } else {
        url.searchParams.set('page', currentPage);
      }
      history.pushState({}, '', url);
    }
  }
</script>

<main>
  <header>
    <div class="logo">小猪储钱罐</div>
    <nav>
      <button class:active={currentPage === 'home'} on:click={() => navigateTo('home')}>
        储钱罐
      </button>
      {#if isParentAuthenticated}
      <button class:active={currentPage === 'admin'} on:click={() => navigateTo('admin')}>
        家长管理
      </button>
      {/if}
      
      {#if isAuthenticated}
        <div class="user-menu">
          <span class="username">{currentUser?.displayName || currentUsername}</span>
          <button class="logout-btn" on:click={() => handleLogout(true)}>退出</button>
        </div>
      {:else}
        <button on:click={goToLogin}>
          登录/注册
        </button>
      {/if}
    </nav>
  </header>

  <div class="content">
    {#if isLoading}
      <div class="loading">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
    {:else if !isAuthenticated && currentPage !== 'login'}
      <div class="auth-prompt">
        <h2>欢迎使用小猪储钱罐</h2>
        <p>请先登录后使用储钱罐功能</p>
        <button class="btn" on:click={goToLogin}>去登录</button>
      </div>
    {:else if currentPage === 'login'}
      {#if loginMode === 'selector'}
        <LoginSelector on:select={handleRoleSelect} />
      {:else}
        <LoginRegister 
          mode={loginMode}
          on:success={handleLoginSuccess}
          on:mode-change={handleLoginModeChange}
        />
      {/if}
    {:else if currentPage === 'home'}
      <PiggyBank />
    {:else if currentPage === 'admin'}
      {#if isParentAuthenticated || isFullyLoggedIn()}
        <AdminPanel onLogout={() => handleLogout(false)} />
      {:else}
        <PasswordProtect bind:authenticated={isParentAuthenticated} />
      {/if}
    {/if}
  </div>

  <footer>
    <p>© {new Date().getFullYear()} 小猪储钱罐 - 帮助孩子学习理财</p>
  </footer>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  header {
    background: #4caf50;
    color: white;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  nav {
    display: flex;
    gap: 0.8rem;
  }
  
  nav button {
    background: transparent;
    border: none;
    color: white;
    padding: 0.5rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
  }
  
  nav button:hover, nav button.active {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .content {
    flex: 1;
    padding: 1rem;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
  }
  
  footer {
    background: #f5f5f5;
    padding: 1rem;
    text-align: center;
    color: #666;
  }
  
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
  }
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #4caf50;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .auth-prompt {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-top: 2rem;
  }
  
  .user-menu {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
  }
  
  .username {
    font-weight: 500;
    font-size: 0.9rem;
  }
  
  .logout-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    color: white;
    cursor: pointer;
    font-size: 0.8rem;
  }
  
  .logout-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 600px) {
    header {
      flex-direction: column;
      gap: 0.8rem;
    }
    
    nav {
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
</style>
