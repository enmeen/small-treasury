<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  // 处理选择
  const selectRole = (role) => {
    dispatch('select', { role });
  };
</script>

<div class="selector-container">
  <div class="selector-card">
    <h2>欢迎使用小猪储钱罐</h2>
    <p>请选择你的身份</p>
    
    <div class="button-container">
      <button class="role-button kid-button" on:click={() => selectRole('kid')}>
        <div class="icon">👶</div>
        <span>我是宝宝</span>
      </button>
      
      <button class="role-button parent-button" on:click={() => selectRole('parent')}>
        <div class="icon">👨‍👩‍👧</div>
        <span>我是家长</span>
      </button>
    </div>
  </div>
</div>

<style>
  .selector-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
    padding: 1rem;
  }
  
  .selector-card {
    background-color: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    text-align: center;
  }
  
  h2 {
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 1.8rem;
  }
  
  p {
    color: #666;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }
  
  .button-container {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .role-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    width: 160px;
    height: 160px;
    transition: all 0.3s ease;
    font-size: 1.2rem;
    font-weight: 600;
  }
  
  .role-button:hover {
    transform: translateY(-5px);
  }
  
  .kid-button {
    background-color: #ffeb3b;
    color: #333;
  }
  
  .kid-button:hover {
    background-color: #fdd835;
    box-shadow: 0 8px 15px rgba(255, 235, 59, 0.3);
  }
  
  .parent-button {
    background-color: #4caf50;
    color: white;
  }
  
  .parent-button:hover {
    background-color: #43a047;
    box-shadow: 0 8px 15px rgba(76, 175, 80, 0.3);
  }
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    .role-button {
      width: 130px;
      height: 130px;
      padding: 1rem;
    }
    
    .icon {
      font-size: 2.5rem;
    }
  }
</style> 