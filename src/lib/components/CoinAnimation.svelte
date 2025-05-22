<script>
  import { 
    COIN_ANIMATION_DURATION_BASE, 
    COIN_ANIMATION_DURATION_PER_AMOUNT, 
    MAX_COIN_ANIMATION_DURATION,
    MIN_COINS,
    MAX_COINS,
    COIN_COUNT_FACTOR
  } from '../constants.js';
  
  // 参数
  export let active = false;
  export let amount = 0;
  export let onAnimationComplete = () => {};
  
  // 投币动画状态
  let coinPositions = [];
  
  // 生成硬币位置
  $: if (active && amount > 0) {
    // 根据金额确定硬币数量，最少MIN_COINS个，最多MAX_COINS个
    const coinCount = Math.min(Math.max(Math.floor(amount / COIN_COUNT_FACTOR), MIN_COINS), MAX_COINS);
    
    // 生成多个硬币的位置
    coinPositions = Array.from({ length: coinCount }, () => ({
      x: Math.random() * 200 - 100,
      y: -150,
      delay: Math.random() * 0.5, // 随机延迟，使硬币落下时间不同
      size: Math.random() * 0.4 + 0.8 // 随机大小，0.8-1.2倍
    }));
    
    // 计算动画持续时间
    const animationDuration = Math.min(
      COIN_ANIMATION_DURATION_BASE + amount * COIN_ANIMATION_DURATION_PER_AMOUNT, 
      MAX_COIN_ANIMATION_DURATION
    );
    
    // 动画结束时触发回调
    setTimeout(() => {
      onAnimationComplete();
    }, animationDuration);
  } else {
    coinPositions = [];
  }
</script>

{#if active && coinPositions.length > 0}
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

<style>
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