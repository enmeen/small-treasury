<script>
  import { piggyBankStore, addMoney } from './stores.js';
  
  // 导入子组件
  import BalanceManager from './components/admin/BalanceManager.svelte';
  import TransactionHistory from './components/admin/TransactionHistory.svelte';
  import GoalHistory from './components/admin/GoalHistory.svelte';
  
  // 登出事件
  export let onLogout = () => {};
  
  // 处理余额更新
  const handleUpdateBalance = (amount, description) => {
    addMoney(amount, description);
  };
</script>

<div class="admin-panel">
  <div class="admin-header">
    <h2>储钱罐管理</h2>
    <button class="btn btn-danger logout-btn" on:click={onLogout}>退出登录</button>
  </div>
  
  <BalanceManager 
    balance={$piggyBankStore.balance}
    onUpdateBalance={handleUpdateBalance}
  />
  
  <TransactionHistory 
    transactions={$piggyBankStore.transactions}
  />
  
  <GoalHistory 
    goals={$piggyBankStore.goals}
  />
</div>

<style>
  .admin-panel {
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  h2 {
    text-align: center;
    margin: 0;
    color: #333;
  }
  
  .logout-btn {
    width: auto;
  }
  
  @media (max-width: 480px) {
    .admin-header {
      flex-direction: column;
      gap: 0.8rem;
    }
    
    .logout-btn {
      width: 100%;
    }
  }
</style> 