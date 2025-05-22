<script>
  export let type = 'primary'; // primary, secondary, danger, success, icon
  export let disabled = false;
  export let title = '';
  export let onClick = () => {};
  export let icon = false;
  export let small = false;
</script>

<button 
  class="button {type} {small ? 'small' : ''} {icon ? 'icon-btn' : ''}"
  {disabled}
  {title}
  on:click={onClick}
>
  <slot />
</button>

<style>
  .button {
    border: none;
    border-radius: 4px;
    padding: 0.7rem 1.5rem;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.3s ease;
    width: 100%;
  }

  .button:hover:not([disabled]) {
    transform: translateY(-2px);
  }

  .button[disabled] {
    background-color: #cccccc;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .button.primary {
    background-color: #4caf50;
    color: white;
  }

  .button.primary:hover:not([disabled]) {
    background-color: #3e8e41;
  }

  .button.secondary {
    background-color: #4ecdc4;
    color: white;
  }

  .button.secondary:hover:not([disabled]) {
    background-color: #3db9b1;
  }

  .button.danger {
    background-color: #f44336;
    color: white;
  }

  .button.danger:hover:not([disabled]) {
    background-color: #d32f2f;
  }

  .button.success {
    background-color: #4caf50;
    color: white;
  }

  .button.success:hover:not([disabled]) {
    background-color: #388e3c;
  }

  .button.small {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
    width: auto;
  }

  .button.icon-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    padding: 0;
  }

  .button.icon-btn:hover:not([disabled]) {
    transform: scale(1.1);
  }
</style> 