<script>
  export let progress;

  import { fade } from "svelte/transition"
</script>

<span>
  <div class="spinner"></div> Converting...
</span>
<div class="progress-bar-container" transition:fade={{ duration: 1000 }}>
  <div class="progress-bar" style={`width: ${progress}%`}>
  </div>
</div>

<style lang="scss">
  @import "../style/global.scss";

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;

    .spinner{
      height: 25px;
      width: 25px;
      border-top: 3px solid rgba(black, .5);
      border-right: 3px solid transparent;
      border-radius: 50%;
      animation: rotation .8s linear infinite;
      margin-right: 10px;
    }
  }

  @keyframes rotation{
    from{
      transform: rotate(0deg);
    }
    to{
      transform: rotate(360deg);
    }
  }

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