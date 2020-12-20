<script>
  import Input from "./components/Input.svelte";
  import Interactable from "./components/Interactable.svelte";
  import NavBar from "./components/NavBar.svelte";
  import Notification from "./components/Notification.svelte";
</script>

<main>
  <NavBar />
  <section class="content-wrapper">
    <div class="background" />
    <div class="content">
      <h2>Video format converter</h2>
      <p>
        No need to download an application, just upload your file and select a
        format to convert to!
      </p>
      <p class="disclaimer">
        Disclaimer: File information is not stored anywhere, and files are not
        used for any purpose other than conversion
      </p>
    </div>
    <Input />
    <Interactable />
  </section>

  <Notification />
</main>

<style lang="scss">
  @import "./style/global.scss";

  :global(body) {
    height: 100vh;
    padding: 0;
    margin: 0;
  }

  :global(*) {
    box-sizing: border-box;
    font-family: Roboto, sans-serif;
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
    padding: 1em;
    margin: 0 auto;

    .content-wrapper {
      position: relative;
      // Same as nav
      width: 80%;
      // Extra large breakpoint
      max-width: 1200px;

      .background {
        z-index: -5;
        position: absolute;
        width: 100%;
        background: #f3f3ff;
        border-radius: 50px;
        height: 375px;
      }

      .content {
        padding: 50px 25px 0 25px;

        h2 {
          font-family: "Montserrat", sans-serif;
          color: $dark-blue;
          font-size: 56px;
          font-weight: 100;
          margin: 0 0 25px 0;
        }

        p {
          color: $dark-blue;
          font-size: 20px;
          margin: 0 0 10px 0;

          &.disclaimer {
            color: $dark-grey;
            font-size: 12px;
            // 2x content padding
            margin-bottom: 50px;
          }
        }
      }
    }
  }
</style>
