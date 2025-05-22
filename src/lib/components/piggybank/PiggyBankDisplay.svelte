<script>
  import { spring } from 'svelte/motion';
  import { onMount } from 'svelte';
  import dogImage from '../../../assets/卡通小狗制作.png';
  
  // 参数
  export let balance = 0;
  
  // 弹簧动画效果
  const displayBalance = spring(0, {
    stiffness: 0.1,
    damping: 0.4
  });
  
  // 投币动画状态
  let showCoins = false;
  let coinPositions = [];
  let currentCoinAnimation = null;
  let animationInProgress = false;
  
  // 更新余额显示的动画
  $: {
    displayBalance.set(balance);
  }
  
  // 计算填充百分比
  $: fillPercentage = Math.min(($displayBalance / 1000) * 100, 100);
  
  // 投币动画函数 - 基础版本
  const animateCoinDrop = () => {
    // 随机位置
    const position = {
      x: Math.random() * 200 - 100,
      y: -150
    };
    
    coinPositions = [position];
    showCoins = true;
    
    // 一段时间后隐藏硬币
    setTimeout(() => {
      showCoins = false;
      coinPositions = [];
    }, 1000);
  };
  
  // 高级投币动画 - 基于金额数量
  export const animateMultipleCoins = (amount) => {
    if (currentCoinAnimation) {
      clearTimeout(currentCoinAnimation);
    }
    
    // 设置动画进行中标志
    animationInProgress = true;
    
    // 根据金额确定硬币数量，最少1个，最多5个
    const coinCount = Math.min(Math.max(Math.floor(amount / 10), 1), 5);
    
    // 生成多个硬币的位置
    coinPositions = Array.from({ length: coinCount }, () => ({
      x: Math.random() * 200 - 100,
      y: -150,
      delay: Math.random() * 0.5, // 随机延迟，使硬币落下时间不同
      size: Math.random() * 0.4 + 0.8 // 随机大小，0.8-1.2倍
    }));
    
    showCoins = true;
    
    // 按照金额调整动画时长，金额越大，时间越长
    const animationDuration = Math.min(1000 + amount * 20, 3000);
    
    currentCoinAnimation = setTimeout(() => {
      showCoins = false;
      coinPositions = [];
      currentCoinAnimation = null;
      animationInProgress = false;
    }, animationDuration);
    
    return animationDuration;
  };
  
  // 每隔一段时间自动播放投币动画
  onMount(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && !showCoins && !animationInProgress) { // 随机决定是否显示
        animateCoinDrop();
      }
    }, 10000); // 降低频率到10秒一次
    
    return () => clearInterval(interval);
  });
  
  // 导出动画状态
  export const isAnimating = () => animationInProgress;
</script>

<div class="piggy-bank-container">
  <div class="doggy-bank">
    <div class="dog-container">
      <!-- 使用卡通狗图片 -->
      <img src={dogImage} alt="狗狗储钱罐" class="dog-image" />
      
      <!-- 投币槽 -->
      <div class="coin-slot"></div>
      
      <!-- 金钱填充区域 -->
      <div class="money-fill" style="height: {fillPercentage}%"></div>
    </div>
    
    <!-- 投币动画 -->
    {#if showCoins}
      {#each coinPositions as coin, i}
        <div 
          class="coin" 
          style="
            left: calc(50% + {coin.x}px); 
            top: {coin.y}px; 
            animation-delay: {coin.delay}s;
            transform: scale({coin.size});
          "
        ></div>
      {/each}
    {/if}
  </div>
  
  <div class="balance-display">
    <h2>当前余额</h2>
    <div class="amount">¥{$displayBalance.toFixed(2)}</div>
  </div>
</div>

<style>
  .piggy-bank-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .doggy-bank {
    position: relative;
    width: 220px;
    height: 200px;
    margin-bottom: 2rem;
  }
  
  .dog-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 10px;
  }
  
  .dog-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: relative;
    z-index: 2;
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
    z-index: 3;
  }
  
  .money-fill {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: rgba(255, 215, 0, 0.5);
    transition: height 0.5s ease-out;
    z-index: 1;
  }
  
  .balance-display {
    text-align: center;
    margin-top: 1rem;
  }
  
  .amount {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
  }
  
  h2 {
    margin: 0;
    color: #555;
    font-size: 1.2rem;
  }
  
  .coin {
    position: absolute;
    width: 30px;
    height: 30px;
    background-color: gold;
    border-radius: 50%;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
    animation: dropCoin 1s ease-in forwards;
    z-index: 10;
  }
  
  @keyframes dropCoin {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(100px) rotate(180deg);
    }
    100% {
      transform: translateY(200px) rotate(360deg);
      opacity: 0;
    }
  }
</style> 