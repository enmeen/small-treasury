<script>
  import { onMount } from 'svelte';
  import PiggyBank from './lib/PiggyBank.svelte';
  import AdminPanel from './lib/AdminPanel.svelte';
  import PasswordProtect from './lib/PasswordProtect.svelte';
  import { refreshData } from './lib/stores.js';

  // 当前页面
  let currentPage = 'home';
  // 认证状态
  let isAuthenticated = false;
  // 加载状态
  let isLoading = true;

  // 切换页面
  const navigateTo = (page) => {
    currentPage = page;
  };
  
  // 处理登出
  const handleLogout = () => {
    // 清除登录状态
    sessionStorage.removeItem('piggyBankAuth');
    isAuthenticated = false;
  };

  // 初始化数据
  onMount(async () => {
    isLoading = true;
    
    try {
      // 异步加载数据
      await refreshData();
      
      // 检查登录状态
      const auth = sessionStorage.getItem('piggyBankAuth');
      if (auth === 'true') {
        isAuthenticated = true;
      }
      
      // 检查URL参数是否有页面指定
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get('page');
      if (page === 'admin') {
        currentPage = 'admin';
      }
      
      // 添加页面变化监听
      window.addEventListener('popstate', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page');
        currentPage = page === 'admin' ? 'admin' : 'home';
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
      <button class:active={currentPage === 'admin'} on:click={() => navigateTo('admin')}>
        家长管理
      </button>
    </nav>
  </header>

  <div class="content">
    {#if isLoading}
      <div class="loading">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>
    {:else if currentPage === 'home'}
      <PiggyBank />
    {:else if currentPage === 'admin'}
      {#if isAuthenticated}
        <AdminPanel onLogout={handleLogout} />
      {:else}
        <PasswordProtect bind:authenticated={isAuthenticated} />
      {/if}
    {/if}
  </div>

  <footer>
    <p>© {new Date().getFullYear()} 小猪储钱罐 - 帮助孩子学习理财</p>
  </footer>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f9f9f9;
    color: #333;
  }
  
  main {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ff6b6b;
  }
  
  nav {
    display: flex;
    gap: 1rem;
  }
  
  nav button {
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 1rem;
    border-radius: 4px;
    color: #666;
    transition: all 0.3s ease;
  }
  
  nav button:hover {
    background-color: #f0f0f0;
  }
  
  nav button.active {
    background-color: #ff6b6b;
    color: white;
  }
  
  .content {
    flex: 1;
    padding: 1rem;
  }
  
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    height: 50vh;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 107, 107, 0.3);
    border-radius: 50%;
    border-top-color: #ff6b6b;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  footer {
    text-align: center;
    padding: 1rem;
    background-color: #ffffff;
    color: #666;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
  }
</style>
