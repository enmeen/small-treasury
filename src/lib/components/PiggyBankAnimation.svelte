<script>
  import { spring } from 'svelte/motion';
  import { onMount } from 'svelte';
  import { COLORS, FILL_HEIGHT_FACTOR } from '../constants.js';
  
  // 参数
  export let balance = 0;
  export let onRandomCoin = () => {};
  
  // 弹簧动画效果
  const displayBalance = spring(0, {
    stiffness: 0.1,
    damping: 0.4
  });
  
  // 更新余额显示的动画
  $: {
    displayBalance.set(balance);
  }
  
  // 计算填充百分比
  $: fillPercentage = Math.min(($displayBalance / FILL_HEIGHT_FACTOR) * 100, 100);
  
  // 每隔一段时间自动播放投币动画
  onMount(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 随机决定是否显示
        onRandomCoin();
      }
    }, 10000); // 每10秒可能触发一次
    
    return () => clearInterval(interval);
  });
</script>

<div class="piggy-bank">
  <div class="pig-body">
    <div class="coin-slot"></div>
    <div class="pig-eye left"></div>
    <div class="pig-eye right"></div>
    <div class="pig-nose"></div>
    <div class="pig-ear left"></div>
    <div class="pig-ear right"></div>
    
    <!-- 金钱填充区域 -->
    <div class="money-fill" style="height: {fillPercentage}%"></div>
  </div>
  <div class="pig-legs">
    <div class="leg front-left"></div>
    <div class="leg front-right"></div>
    <div class="leg back-left"></div>
    <div class="leg back-right"></div>
  </div>
  
  <!-- 投币动画 将由父组件通过slot传入 -->
  <slot />
</div>

<style>
  .piggy-bank {
    position: relative;
    width: 200px;
    height: 160px;
    margin-bottom: 2rem;
  }
  
  .pig-body {
    position: relative;
    width: 200px;
    height: 140px;
    background-color: var(--piggy-light, #ffb6c1);
    border-radius: 100px;
    overflow: hidden;
  }
  
  .coin-slot {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 5px;
    background-color: #333;
    border-radius: 5px;
  }
  
  .pig-eye {
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: #333;
    border-radius: 50%;
    top: 45px;
  }
  
  .pig-eye.left {
    left: 50px;
  }
  
  .pig-eye.right {
    right: 50px;
  }
  
  .pig-nose {
    position: absolute;
    width: 30px;
    height: 22px;
    background-color: var(--piggy-dark, #ff7f7f);
    border-radius: 50%;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .pig-ear {
    position: absolute;
    width: 30px;
    height: 30px;
    background-color: var(--piggy-light, #ffb6c1);
    border-radius: 50%;
    top: 20px;
  }
  
  .pig-ear.left {
    left: 10px;
    transform: rotate(-30deg);
  }
  
  .pig-ear.right {
    right: 10px;
    transform: rotate(30deg);
  }
  
  .pig-legs {
    display: flex;
    justify-content: space-between;
    width: 180px;
    margin: 0 auto;
  }
  
  .leg {
    width: 15px;
    height: 20px;
    background-color: var(--piggy-light, #ffb6c1);
    border-radius: 5px;
  }
  
  .money-fill {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: var(--money-fill, rgba(255, 215, 0, 0.5));
    transition: height 0.5s ease-out;
  }
</style> 