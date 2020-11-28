<script>
  export let progress;

  import { fade } from "svelte/transition"
</script>

<div class="progress-bar-container" transition:fade={{ duration: 1000 }}>
  <div class="progress-bar" style={`width: ${progress}%`}>
  </div>
</div>

<style lang="scss">
  @import "../style/global.scss";

  .progress-bar-container {
    width: 500px;
    border: 2px solid $dark-blue;
    border-radius: 30px;
    height: 20px;
    overflow: hidden;

    .progress-bar {
      background: $light-blue;
      width: 0;
      height: 30px;
      transition: width 0.3s;
    }
  }
</style>