<script>
  export let title = '';
</script>

<div class="card">
  {#if title}
    <h3 class="card-title">{title}</h3>
  {/if}
  <slot />
</div>

<style>
  .card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
  }
  
  .card-title {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #444;
    font-size: 1.1rem;
  }
</style> 