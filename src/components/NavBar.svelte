<nav>
  <div class="left">
    <!-- <h1>App Name + logo</h1> -->
  </div>
  <ul class="right">
    <li>
      <a href="https://www.buymeacoffee.com/achan" target="_blank">
        Buy me a coffee!
      </a>
    </li>
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
      <a
        href="https://github.com/dowinterfor6/video-converter/issues"
        target="_blank">
        Report a bug
      </a>
    </li>
    <li>
      <a
        href="https://github.com/dowinterfor6/video-converter/"
        target="_blank">
        Github
      </a>
    </li>
  </ul>
</nav>

<style lang="scss">
  @import "../style/global.scss";

  $dropdown-element-padding: 10px;

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    width: 80%;
    max-width: $extra-large-screen;
    padding: 5px 30px 0 30px;
    top: 0;

    .right {
      width: 50%;
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
          padding: 0;
          visibility: hidden;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.3);
          position: absolute;
          overflow: hidden;
          opacity: 0;
          z-index: 5;
          max-height: 0;
          transition: all 0.5s;
          color: $dark-blue;
          background: white;
          transform: translateX($dropdown-element-padding);

          li {
            text-align: left;
            padding: $dropdown-element-padding;

            &:hover {
              background-color: $grey;
              color: $blue;
            }
          }
        }

        &:hover ul {
          visibility: visible;
          opacity: 1;
          max-height: 500px;
        }
      }
    }
  }
</style>
