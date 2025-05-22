<script>
  export let label = '';
  export let required = false;
  export let hint = '';
</script>

<div class="form-group">
  {#if label}
    <label for={$$slots.default?.[0]?.id}>
      {label} {#if required}<span class="required">*</span>{/if}
    </label>
  {/if}
  
  <slot />
  
  {#if hint}
    <small>{hint}</small>
  {/if}
</div>

<style>
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .required {
    color: #f44336;
  }
  
  small {
    display: block;
    color: #777;
    margin-top: 0.25rem;
    font-size: 0.75rem;
  }
</style> 