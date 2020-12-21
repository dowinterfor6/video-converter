<script>
  export let progress;

  import { fade } from "svelte/transition";
</script>

<div class="progress-bar-container" in:fade={{ duration: 200, delay: 200 }}>
  <span>
    <div class="spinner" />
    Converting...
  </span>
  <div class="progress-bar-wrapper">
    <div
      role="progressbar"
      class="progress-bar"
      style={`width: ${progress}%`} />
  </div>
</div>

<style lang="scss">
  @import "../style/global.scss";

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .progress-bar-container {
    position: absolute;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;

      .spinner {
        height: 25px;
        width: 25px;
        border-top: 3px solid rgba(black, 0.5);
        border-right: 3px solid transparent;
        border-radius: 50%;
        animation: rotation 0.8s linear infinite;
        margin-right: 10px;
      }
    }

    .progress-bar-wrapper {
      width: 100%;
      max-width: $interactables-container-width;
      border: 2px solid $dark-blue;
      border-radius: 30px;
      height: 20px;
      overflow: hidden;

      .progress-bar {
        background: $light-blue;
        width: 0;
        height: 30px;
        transition: width $short-anim-duration;
      }
    }
  }
</style>
