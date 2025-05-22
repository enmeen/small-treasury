<script>
  import { formatCurrency, calculateProgress, getGoalStatus } from '../utils.js';
  
  // 参数
  export let goal;
  export let balance = 0;
  export let onComplete = () => {};
  export let onDelete = () => {};
  
  // 计算目标进度
  $: progress = calculateProgress(balance, goal.amount);
  $: isAchieved = progress >= 100 || goal.completed;
  
  // 处理完成目标
  const handleComplete = () => {
    if (window.confirm('确定要将此目标标记为已完成吗？')) {
      onComplete(goal.id);
    }
  };
  
  // 处理删除目标
  const handleDelete = () => {
    if (window.confirm('确定要删除此目标吗？此操作不可撤销。')) {
      onDelete(goal.id);
    }
  };
</script>

<div class="goal-card" class:goal-completed={isAchieved}>
  <div class="goal-icon">
    {#if isAchieved}
      <div class="goal-star">★</div>
    {:else}
      <div class="piggy-icon">🐷</div>
    {/if}
  </div>
  <div class="goal-details">
    <h4>{goal.name}</h4>
    <div class="goal-progress-bar">
      <div 
        class="goal-progress-fill" 
        style="width: {progress}%"
      ></div>
    </div>
    <div class="goal-progress-info">
      <div class="goal-amount">
        进度：{Math.round(progress)}% ({formatCurrency(goal.amount)})
      </div>
      <div class="goal-status">
        {getGoalStatus(goal, progress)}
      </div>
    </div>
  </div>
  <div class="goal-actions">
    {#if !goal.completed}
      <button 
        class="icon-btn complete-btn" 
        title="标记为已完成"
        on:click={handleComplete}
      >
        ✓
      </button>
    {/if}
    <button 
      class="icon-btn delete-btn" 
      title="删除目标"
      on:click={handleDelete}
    >
      ✕
    </button>
  </div>
</div>

<style>
  .goal-card {
    display: flex;
    align-items: center;
    background-color: #f9f9f9;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    border-left: 5px solid #4ecdc4;
    gap: 0.8rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin-bottom: 0.5rem;
  }
  
  .goal-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  
  .goal-card.goal-completed {
    border-left-color: gold;
    background-color: #f8f8f0;
  }
  
  .goal-icon {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
  }
  
  .goal-star {
    color: gold;
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.7);
    animation: pulse 1.5s infinite;
  }
  
  .piggy-icon {
    animation: bounce 2s infinite;
    transform-origin: center bottom;
  }
  
  .goal-details {
    flex-grow: 1;
  }
  
  .goal-details h4 {
    margin: 0 0 0.4rem 0;
    color: #444;
    font-weight: 600;
    font-size: 1rem;
  }
  
  .goal-progress-bar {
    height: 8px;
    background-color: #eee;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.3rem;
  }
  
  .goal-progress-fill {
    height: 100%;
    background: linear-gradient(to right, #4ecdc4, #56e2d9);
    transition: width 0.3s ease;
  }
  
  .goal-completed .goal-progress-fill {
    background: linear-gradient(to right, #ffd700, #ffeb3b);
  }
  
  .goal-progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .goal-amount {
    font-size: 0.8rem;
    color: #666;
    font-weight: 500;
  }
  
  .goal-status {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    background-color: #e8f5f4;
    color: #4ecdc4;
    border-radius: 20px;
    font-weight: 600;
  }
  
  .goal-completed .goal-status {
    background-color: #fff8e1;
    color: #ffc107;
  }
  
  .goal-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .icon-btn {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;
    padding: 0;
  }
  
  .complete-btn {
    background-color: #4caf50;
    color: white;
  }
  
  .complete-btn:hover {
    background-color: #388e3c;
    transform: scale(1.1);
  }
  
  .delete-btn {
    background-color: #f44336;
    color: white;
  }
  
  .delete-btn:hover {
    background-color: #d32f2f;
    transform: scale(1.1);
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-5px);
    }
    60% {
      transform: translateY(-3px);
    }
  }
</style> 