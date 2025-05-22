<script>
  // 参数
  export let transactions = [];
  export let onDeposit;
  
  // 计算待投入总金额
  $: pendingTotal = transactions.reduce((sum, t) => sum + t.amount, 0);
  
  // 投币动画状态
  export let isAnimating = false;
</script>

<div class="card">
  <h3>待投入的金额 {transactions.length > 0 ? `(¥${pendingTotal.toFixed(2)})` : ''}</h3>
  
  {#if transactions.length === 0}
    <p class="empty-state">暂无待投入金额</p>
  {:else}
    {#each transactions as transaction}
      <div class="transaction-item">
        <div class="transaction-info">
          <div class="transaction-amount">+¥{transaction.amount.toFixed(2)}</div>
          <div class="transaction-desc">{transaction.description}</div>
          <div class="transaction-date">{new Date(transaction.date).toLocaleString()}</div>
        </div>
        <button 
          class="btn btn-accent deposit-btn" 
          on:click={() => onDeposit(transaction)}
          disabled={isAnimating}
        >
          {isAnimating ? '投入中...' : '投入'}
        </button>
      </div>
    {/each}
  {/if}
</div>

<style>
  .transaction-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem;
    border-bottom: 1px solid #eee;
    background-color: #f9f9f9;
    border-radius: 6px;
    margin-bottom: 0.5rem;
  }
  
  .transaction-info {
    flex-grow: 1;
  }
  
  .transaction-amount {
    font-weight: bold;
    color: #4caf50;
    font-size: 1.1rem;
  }
  
  .transaction-desc {
    font-size: 0.9rem;
    color: #555;
  }
  
  .transaction-date {
    font-size: 0.8rem;
    color: #777;
  }
  
  .deposit-btn {
    width: auto;
    font-size: 0.9rem;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 30px;
  }
  
  @media (max-width: 480px) {
    .transaction-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .deposit-btn {
      width: 100%;
    }
  }
</style> 