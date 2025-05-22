<script>
  import ConfirmDialog from '../ConfirmDialog.svelte';
  
  // 参数
  export let balance = 0;
  export let onUpdateBalance;
  
  // 表单数据
  let amount = '';
  let description = '';
  let isAdding = true;
  let formError = '';
  
  // 确认对话框状态
  let showConfirmDialog = false;
  let confirmAction = null;
  let confirmMessage = '';
  let confirmTitle = '';
  
  // 处理添加/减少金额
  const handleBalanceUpdate = () => {
    // 验证金额
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      formError = '请输入有效金额（必须大于0）';
      return;
    }
    
    // 验证描述
    if (!description.trim()) {
      formError = '请输入交易描述';
      return;
    }
    
    // 如果是减少金额，检查余额是否足够
    if (!isAdding && parseFloat(amount) > balance) {
      formError = `余额不足！当前余额为 ¥${balance.toFixed(2)}，无法取出 ¥${parseFloat(amount).toFixed(2)}`;
      return;
    }
    
    formError = ''; // 清除错误
    
    // 准备确认信息
    const amountValue = isAdding ? parseFloat(amount) : -parseFloat(amount);
    confirmTitle = isAdding ? '确认存入金额' : '确认取出金额';
    confirmMessage = `您确定要${isAdding ? '存入' : '取出'} ¥${Math.abs(amountValue).toFixed(2)} 吗？\n描述：${description}`;
    
    // 设置确认后的动作
    confirmAction = () => {
      try {
        onUpdateBalance(amountValue, description);
        
        // 重置表单
        amount = '';
        description = '';
      } catch (error) {
        formError = error.message;
      }
    };
    
    // 显示确认对话框
    showConfirmDialog = true;
  };
</script>

<div class="card">
  <h3>当前余额: ¥{balance.toFixed(2)}</h3>
  
  <div class="form-group">
    <label>
      <input type="radio" bind:group={isAdding} value={true}>
      添加金额
    </label>
    <label>
      <input type="radio" bind:group={isAdding} value={false}>
      减少金额
    </label>
  </div>
  
  <div class="form-group">
    <label for="amount">金额: <span class="required">*</span></label>
    <input 
      type="number" 
      id="amount"
      placeholder="请输入金额" 
      bind:value={amount}
      min="0"
      step="0.01"
      required
    />
  </div>
  
  <div class="form-group">
    <label for="description">描述: <span class="required">*</span></label>
    <input 
      type="text" 
      id="description"
      placeholder="例如：压岁钱、零花钱" 
      bind:value={description}
      required
    />
    <small>请描述这笔交易的来源或用途，必填</small>
  </div>
  
  {#if formError}
    <div class="error-message">{formError}</div>
  {/if}
  
  <button class="btn" on:click={handleBalanceUpdate}>
    {isAdding ? '存入' : '取出'}
  </button>
  
  <!-- 确认对话框 -->
  <ConfirmDialog
    bind:show={showConfirmDialog}
    title={confirmTitle}
    message={confirmMessage}
    confirmText={isAdding ? '确认存入' : '确认取出'}
    type={isAdding ? 'primary' : 'danger'}
    on:confirm={() => confirmAction && confirmAction()}
  />
</div>

<style>
  .required {
    color: #f44336;
  }
</style> 