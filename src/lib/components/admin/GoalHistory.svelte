<script>
  // 参数
  export let goals = [];
  
  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '未完成';
    return new Date(dateString).toLocaleString();
  };
</script>

<div class="card">
  <h3>储蓄目标记录</h3>
  
  {#if goals.length === 0}
    <p class="empty-state">暂无储蓄目标记录</p>
  {:else}
    <div class="goals-table">
      <table>
        <thead>
          <tr>
            <th>目标名称</th>
            <th>金额</th>
            <th>状态</th>
            <th>完成时间</th>
          </tr>
        </thead>
        <tbody>
          {#each goals as goal}
            <tr class:goal-deleted={goal.deleted} class:goal-completed={goal.completed}>
              <td>{goal.name}</td>
              <td>¥{goal.amount.toFixed(2)}</td>
              <td>
                {#if goal.completed}
                  <span class="badge badge-primary">已完成</span>
                {:else}
                  <span class="badge badge-secondary">进行中</span>
                {/if}
                {#if goal.deleted}
                  <span class="badge badge-danger">已删除</span>
                {/if}
              </td>
              <td>{formatDate(goal.completedAt)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .goals-table {
    overflow-x: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }
  
  th, td {
    padding: 0.8rem 0.5rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    font-weight: 600;
    color: #555;
    background-color: #f9f9f9;
  }
  
  .goal-completed {
    background-color: #f8f8f0;
  }
  
  .goal-deleted {
    background-color: #fff8f8;
  }
  
  @media (max-width: 480px) {
    th, td {
      padding: 0.6rem 0.4rem;
      font-size: 0.8rem;
    }
  }
</style> 