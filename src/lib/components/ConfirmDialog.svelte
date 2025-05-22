<script>
  import { createEventDispatcher } from 'svelte';
  
  // 参数
  export let show = false;
  export let title = '确认操作';
  export let message = '您确定要执行此操作吗？';
  export let confirmText = '确认';
  export let cancelText = '取消';
  export let type = 'primary'; // primary, danger, success
  
  // 事件分发器
  const dispatch = createEventDispatcher();
  
  // 确认操作
  function confirm() {
    dispatch('confirm');
    show = false;
  }
  
  // 取消操作
  function cancel() {
    dispatch('cancel');
    show = false;
  }
  
  // 点击背景关闭
  function handleBackdropClick(event) {
    // 仅当点击的是背景时关闭，避免点击对话框内容时关闭
    if (event.target === event.currentTarget) {
      cancel();
    }
  }
  
  // 按ESC键关闭
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      cancel();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <div class="dialog-backdrop" on:click={handleBackdropClick}>
    <div class="dialog-container" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div class="dialog-header">
        <h3 id="dialog-title">{title}</h3>
      </div>
      <div class="dialog-content">
        <p>{message}</p>
      </div>
      <div class="dialog-actions">
        <button class="btn-cancel" on:click={cancel}>{cancelText}</button>
        <button class="btn-confirm {type}" on:click={confirm}>{confirmText}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .dialog-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease-out;
  }
  
  .dialog-container {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: scaleIn 0.2s ease-out;
    overflow: hidden;
  }
  
  .dialog-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #eee;
  }
  
  .dialog-header h3 {
    margin: 0;
    color: #333;
    font-size: 1.1rem;
  }
  
  .dialog-content {
    padding: 1.5rem;
  }
  
  .dialog-content p {
    margin: 0;
    color: #555;
    line-height: 1.5;
  }
  
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    padding: 1rem 1.5rem;
    gap: 0.5rem;
    border-top: 1px solid #eee;
  }
  
  button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
  }
  
  .btn-cancel {
    background-color: #f5f5f5;
    color: #555;
  }
  
  .btn-cancel:hover {
    background-color: #e5e5e5;
  }
  
  .btn-confirm {
    color: white;
  }
  
  .btn-confirm.primary {
    background-color: #4caf50;
  }
  
  .btn-confirm.primary:hover {
    background-color: #3e8e41;
  }
  
  .btn-confirm.danger {
    background-color: #f44336;
  }
  
  .btn-confirm.danger:hover {
    background-color: #d32f2f;
  }
  
  .btn-confirm.success {
    background-color: #4ecdc4;
  }
  
  .btn-confirm.success:hover {
    background-color: #3db9b1;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes scaleIn {
    from {
      transform: scale(0.9);
    }
    to {
      transform: scale(1);
    }
  }
  
  /* 移动端适配 */
  @media (max-width: 480px) {
    .dialog-container {
      width: 95%;
      max-width: none;
      border-radius: 6px;
    }
    
    .dialog-header {
      padding: 0.8rem 1rem;
    }
    
    .dialog-content {
      padding: 1rem;
    }
    
    .dialog-actions {
      padding: 0.8rem 1rem;
    }
    
    button {
      flex: 1;
      padding: 0.6rem 0.8rem;
      font-size: 0.9rem;
    }
  }
</style> 