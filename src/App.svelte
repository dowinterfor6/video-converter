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
      <h2>Video converter</h2>
      <p>Upload your file and select a format to convert to!</p>
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

  :global(ul) {
    list-style: none;
    padding: 0;
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
    padding: 5%;
    margin: 0 auto;

    .content-wrapper {
      position: relative;
      width: 100%;
      max-width: $extra-large-screen;

      .background {
        z-index: -5;
        position: absolute;
        width: 100%;
        background: $background-blue;
        border-radius: 50px;
        height: 300px;
      }

      .content {
        padding: 50px 25px 0 25px;

        h2 {
          font-family: "Montserrat", sans-serif;
          color: $dark-blue;
          font-size: 30px;
          font-weight: 100;
          margin: 0 0 25px 0;
        }

        p {
          color: $dark-blue;
          font-size: 16px;
          margin: 0 0 10px 0;

          &.disclaimer {
            color: $dark-grey;
            font-size: 12px;
            margin-bottom: 25px;
          }
        }
      }
    }

    @media only screen and (min-width: $medium-screen) {
      padding: 16px;

      .content-wrapper {
        width: $main-width;

        .background {
          height: 350px;
        }

        .content {
          h2 {
            font-size: 42px;
          }

          p {
            font-size: 16px;
          }
        }
      }
    }

    @media only screen and (min-width: $large-screen) {
      padding: 16px;

      .content-wrapper {
        .background {
          height: 400px;
        }

        .content {
          h2 {
            font-size: 56px;
          }

          p {
            font-size: 20px;
          }
        }
      }
    }
  }
</style>
