<script>
  import { fade } from 'svelte/transition';
  let show = true;
</script>

{#if show}
  <footer transition:fade={{ duration: 200 }}>
    Disclaimer: Files are not stored, and used for the sole purpose of conversion.
    <div>
      <button on:click={() => show = false}>Got it!</button>
    </div>
  </footer>
{/if}

<style lang="scss">
  footer {
    border: 1px solid #ccc;
    border-radius: 2px;
    padding: 20px;
    position: absolute;
    bottom: 0;
    font-size: 12px;
    color: #303030;
    display: flex;
    flex-direction: column;

    button {
      font-size: 12px;
      margin-top: 10px;
      width: auto;
    }
  }
</style>