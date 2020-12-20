<script>
  import { notificationMessage } from "../store/store";
  import { fade } from "svelte/transition";

  let message;

  notificationMessage.subscribe((msg) => (message = msg));

  const close = () => notificationMessage.set("");
</script>

{#if message}
  <div transition:fade={{ duration: 200 }}>
    <p><span on:click={close}>×</span> {message}</p>
  </div>
{/if}

<style lang="scss">
  @import "../style/global.scss";

  div {
    position: absolute;
    border: 1px solid $medium-grey;
    right: 10px;
    bottom: 10px;
    padding: 15px;
    background: white;
    width: 250px;
    transition: all 0.2s;

    p {
      position: relative;
      margin: 12px;
      font-size: 11px;
      color: $red;

      span {
        font-size: 24px;
        right: -12px;
        top: -24px;
        color: $dark-blue;
        position: absolute;
        float: right;
        cursor: pointer;

        &:hover {
          color: $blue;
        }
      }
    }
  }
</style>
