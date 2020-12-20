<script>
</script>

<nav>
  <div class="left">
    <!-- <h1>App Name + logo</h1> -->
  </div>
  <ul class="right">
    <li><a href="https://www.buymeacoffee.com/achan"> Buy me a coffee! </a></li>
    <li class="dropdown">
      Credits
      <ul>
        <li>
          <a
            href="https://www.flaticon.com/authors/monkik"
            title="monkik"
            target="_blank">
            Favicon - monkik
          </a>
        </li>
        <li>
          <a
            href="https://www.flaticon.com/authors/pixel-perfect"
            title="Pixel perfect"
            target="_blank">
            Download icon - Pixel perfect
          </a>
        </li>
        <li>
          <a
            href="https://www.flaticon.com/authors/becris"
            title="Becris"
            target="_blank">
            Convert icon - Becris
          </a>
        </li>
        <li>
          <a
            href="https://www.flaticon.com/authors/smashicons"
            title="Smashicons"
            target="_blank">
            Down arrow icon - Smashicons
          </a>
        </li>
        <li>
          <a
            href="https://www.flaticon.com/authors/freepik"
            title="Freepik"
            target="_blank">
            Close icon - Freepik
          </a>
        </li>
        <li>
          <a
            href="https://codepen.io/Paolo-Duzioni/pen/ZoRabJ"
            title="Paolo Duzioni"
            target="_blank">
            Loading spinner - Paolo Duzioni
          </a>
        </li>
      </ul>
    </li>
    <li>
      <a href="https://github.com/dowinterfor6/video-converter/issues">
        Report a bug
      </a>
    </li>
  </ul>
</nav>

<style lang="scss">
  @import "../style/global.scss";

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    width: 80%;
    // Extra large breakpoint
    max-width: 1200px;
    padding: 5px 30px 0 30px;
    top: 0;

    // .left {
    //   h1 {
    //     font-family: "Montserrat", sans-serif;
    //     color: $red;
    //     font-size: 36px;
    //     font-weight: 100;
    //     margin: 0;
    //   }
    // }

    .right {
      list-style: none;
      padding: 0;
      width: 40%;
      display: flex;
      justify-content: space-evenly;
      color: $dark-blue;
      cursor: pointer;

      li {
        text-align: center;

        a {
          color: inherit;
          text-decoration: none;
        }

        &:hover {
          color: $blue;
        }
      }

      .dropdown {
        position: relative;

        ul {
          width: 250px;
          top: 25px;
          list-style: none;
          padding: 0;
          // display: none;
          visibility: hidden;
          border: 1px solid $medium-grey;
          position: absolute;
          overflow: hidden;
          opacity: 0;
          max-height: 0;
          transition: all 0.5s;
          z-index: 5;
          color: $dark-blue;
          background: white;

          li {
            text-align: left;
            padding: 10px;

            &:hover {
              background-color: $grey;
              color: $blue;
            }
          }
        }

        &:hover ul {
          // display: block;
          visibility: visible;
          opacity: 1;
          max-height: 500px;
        }
      }
    }
  }
</style>
