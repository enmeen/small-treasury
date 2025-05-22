<script>
  // 参数
  export let transactions = [];
  
  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };
</script>

<div class="card">
  <h3>交易记录</h3>
  
  {#if transactions.length === 0}
    <p class="empty-state">暂无交易记录</p>
  {:else}
    <div class="transactions">
      {#each transactions as transaction}
        <div class="transaction-item">
          <div class="transaction-amount" class:positive={transaction.amount > 0} class:negative={transaction.amount < 0}>
            {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
          </div>
          <div class="transaction-details">
            <div class="transaction-desc">{transaction.description || '无描述'}</div>
            <div class="transaction-date">{formatDate(transaction.date)}</div>
            <div class="transaction-status">
              {#if transaction.amount > 0}
                状态: {transaction.deposited ? '已存储' : '待存储'}
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .transactions {
    max-height: 300px;
    overflow-y: auto;
  }
  
  .transaction-item {
    display: flex;
    align-items: center;
    padding: 0.8rem 0;
    border-bottom: 1px solid #eee;
  }
  
  .transaction-amount {
    width: 100px;
    font-weight: bold;
    font-size: 1.1rem;
  }
  
  .positive {
    color: #4caf50;
  }
  
  .negative {
    color: #f44336;
  }
  
  .transaction-details {
    flex-grow: 1;
  }
  
  .transaction-desc {
    font-weight: 500;
  }
  
  .transaction-date {
    font-size: 0.8rem;
    color: #777;
  }
  
  .transaction-status {
    font-size: 0.8rem;
    color: #777;
    font-style: italic;
  }
  
  @media (max-width: 480px) {
    .transaction-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.3rem;
    }
    
    .transaction-amount {
      width: auto;
    }
  }
</style> 