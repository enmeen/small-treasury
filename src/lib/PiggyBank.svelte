<script>
  import { piggyBankStore, markTransactionAsDeposited, createGoal, completeGoal, removeGoal, addMoney } from './stores.js';
  
  // 导入子组件
  import PiggyBankDisplay from './components/piggybank/PiggyBankDisplay.svelte';
  import TransactionList from './components/piggybank/TransactionList.svelte';
  import GoalManager from './components/piggybank/GoalManager.svelte';
  
  // 过滤出未投币的交易
  $: pendingTransactions = $piggyBankStore.transactions.filter(
    t => t.amount > 0 && !t.deposited
  );
  
  // 处理交易投币
  let piggyBankDisplayComponent;
  const handleDeposit = (transaction) => {
    if (piggyBankDisplayComponent.isAnimating()) return; // 防止动画重叠
    
    // 开始投币动画
    piggyBankDisplayComponent.animateMultipleCoins(transaction.amount);
    
    // 动画开始后立即更新交易状态，这样余额会立即更新
    markTransactionAsDeposited(transaction.id);
  };
  
  // 处理添加目标
  const handleAddGoal = (name, amount) => {
    createGoal(name, amount);
  };
  
  // 处理完成目标
  const handleCompleteGoal = (goalId) => {
    const goal = $piggyBankStore.goals.find(g => g.id === goalId);
    if (!goal) return;
    
    // 先扣除余额
    addMoney(-goal.amount, `完成目标：${goal.name}`);
    
    // 再标记为完成
    completeGoal(goalId);
  };
  
  // 处理删除目标
  const handleDeleteGoal = (goalId) => {
    removeGoal(goalId);
  };
</script>

<div class="piggy-container">
  <PiggyBankDisplay 
    balance={$piggyBankStore.balance}
    bind:this={piggyBankDisplayComponent} 
  />
  
  <TransactionList 
    transactions={pendingTransactions} 
    onDeposit={handleDeposit}
    isAnimating={piggyBankDisplayComponent?.isAnimating() || false}
  />
  
  <GoalManager 
    goals={$piggyBankStore.goals.filter(g => !g.deleted)} 
    balance={$piggyBankStore.balance}
    onAddGoal={handleAddGoal}
    onCompleteGoal={handleCompleteGoal}
    onDeleteGoal={handleDeleteGoal}
  />
</div>

<style>
  .piggy-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }
</style> 