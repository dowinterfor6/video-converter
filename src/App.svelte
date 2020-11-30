<script>
  import Disclaimer from "./components/Disclaimer.svelte";
  import Input from "./components/Input.svelte";
  import Interactable from "./components/Interactable.svelte";
</script>

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
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    font-family: "Montserrat", sans-serif;
    color: $red;
    font-size: 4em;
    font-weight: 100;
    margin-bottom: 75px;
  }
</style>

<main>
  <h1>Video Converter</h1>
  <!-- <div>Favicon made by <a href="https://www.flaticon.com/authors/monkik" title="monkik">monkik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> -->
  <!-- <div>Download icon made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> -->
  <!-- <div>Convert icon made by <a href="https://www.flaticon.com/authors/becris" title="Becris">Becris</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> -->
  <!-- <div>Down arrow icon made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> -->
  <!-- <div>Close icon made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> -->
  <!-- Loading spinner https://codepen.io/Paolo-Duzioni/pen/ZoRabJ -->

  <Input />
  <Interactable />
  <Disclaimer />
</main>
