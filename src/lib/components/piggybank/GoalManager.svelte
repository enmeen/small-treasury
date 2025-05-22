<script>
  import ConfirmDialog from '../ConfirmDialog.svelte';
  
  // 参数
  export let goals = [];
  export let balance = 0;
  export let onAddGoal;
  export let onCompleteGoal;
  export let onDeleteGoal;
  
  // 目标管理状态
  let showGoalForm = false;
  let goalName = '';
  let goalAmount = '';
  let goalError = '';
  
  // 确认对话框状态
  let showConfirmDialog = false;
  let confirmAction = null;
  let confirmMessage = '';
  let confirmTitle = '';
  let confirmType = 'primary';
  let confirmButtonText = '确认';
  let selectedGoalId = null;
  
  // 处理添加目标
  const handleAddGoal = () => {
    if (!goalName.trim()) {
      goalError = '请输入目标名称';
      return;
    }
    
    if (!goalAmount || isNaN(parseFloat(goalAmount)) || parseFloat(goalAmount) <= 0) {
      goalError = '请输入有效的目标金额';
      return;
    }
    
    onAddGoal(goalName, parseFloat(goalAmount));
    
    // 重置表单
    goalName = '';
    goalAmount = '';
    goalError = '';
    showGoalForm = false;
  };
  
  // 准备完成目标
  const prepareCompleteGoal = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    // 检查余额是否足够
    if (balance < goal.amount) {
      alert(`余额不足！完成此目标需要 ¥${goal.amount.toFixed(2)}，但当前余额仅有 ¥${balance.toFixed(2)}`);
      return;
    }
    
    selectedGoalId = goalId;
    confirmTitle = '完成储蓄目标';
    confirmMessage = `确定要将"${goal.name}"标记为已完成吗？将从余额中扣除 ¥${goal.amount.toFixed(2)}。`;
    confirmType = 'success';
    confirmButtonText = '确认完成';
    
    // 设置确认后的动作
    confirmAction = () => {
      onCompleteGoal(goalId);
    };
    
    // 显示确认对话框
    showConfirmDialog = true;
  };
  
  // 准备删除目标
  const prepareDeleteGoal = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    selectedGoalId = goalId;
    confirmTitle = '删除储蓄目标';
    confirmMessage = `确定要删除"${goal.name}"吗？此操作不可撤销。`;
    confirmType = 'danger';
    confirmButtonText = '确认删除';
    
    // 设置确认后的动作
    confirmAction = () => {
      onDeleteGoal(goalId);
    };
    
    // 显示确认对话框
    showConfirmDialog = true;
  };
  
  // 计算目标进度
  const calculateGoalProgress = (goal) => {
    // 根据总余额计算
    return Math.min((balance / goal.amount) * 100, 100);
  };
  
  // 计算目标达成状态
  const getGoalStatus = (goal) => {
    if (goal.completed) return '已完成';
    
    const percentage = calculateGoalProgress(goal);
    if (percentage >= 100) return '已达成';
    if (percentage >= 75) return '即将达成';
    if (percentage >= 50) return '进行中';
    if (percentage >= 25) return '努力存钱中';
    return '刚开始';
  };
</script>

<div class="card">
  <div class="goals-header">
    <h3>我的储蓄目标</h3>
    <button 
      class="btn btn-secondary btn-small"
      on:click={() => showGoalForm = !showGoalForm}
    >
      {showGoalForm ? '取消' : '+ 添加目标'}
    </button>
  </div>
  
  <!-- 添加目标表单 -->
  {#if showGoalForm}
    <div class="goal-form">
      <div class="form-group">
        <label for="goalName">目标名称：</label>
        <input 
          type="text" 
          id="goalName"
          placeholder="例如：新玩具、新书" 
          bind:value={goalName}
        />
      </div>
      
      <div class="form-group">
        <label for="goalAmount">需要金额：</label>
        <input 
          type="number" 
          id="goalAmount"
          placeholder="输入需要的金额" 
          bind:value={goalAmount}
          min="0"
          step="0.01"
        />
      </div>
      
      {#if goalError}
        <div class="error-message">{goalError}</div>
      {/if}
      
      <button class="btn btn-secondary" on:click={handleAddGoal}>
        创建目标
      </button>
    </div>
  {/if}
  
  <!-- 目标列表 -->
  {#if goals.length === 0}
    <p class="empty-state">暂无储蓄目标，添加一个吧！</p>
  {:else}
    <div class="goals-list">
      {#each goals as goal}
        {@const progress = calculateGoalProgress(goal)}
        {@const isAchieved = progress >= 100 || goal.completed}
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
                进度：{Math.round(progress)}% (¥{goal.amount.toFixed(2)})
              </div>
              <div class="goal-status">
                {getGoalStatus(goal)}
              </div>
            </div>
          </div>
          <div class="goal-actions">
            {#if !goal.completed}
              <button 
                class="icon-btn complete-btn" 
                title="标记为已完成"
                on:click={() => prepareCompleteGoal(goal.id)}
              >
                ✓
              </button>
            {/if}
            <button 
              class="icon-btn delete-btn" 
              title="删除目标"
              on:click={() => prepareDeleteGoal(goal.id)}
            >
              ✕
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
  
  <!-- 确认对话框 -->
  <ConfirmDialog
    bind:show={showConfirmDialog}
    title={confirmTitle}
    message={confirmMessage}
    confirmText={confirmButtonText}
    type={confirmType}
    on:confirm={() => confirmAction && confirmAction()}
  />
</div>

<style>
  .goals-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .goal-form {
    background-color: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border: 2px dashed #4ecdc4;
  }
  
  .goals-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
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