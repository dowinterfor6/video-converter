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

    .left {
      h1 {
        font-family: "Montserrat", sans-serif;
        color: $red;
        font-size: 36px;
        font-weight: 100;
        margin: 0;
      }
    }

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
    }
  }
</style>

<nav>
  <div class="left">
    <!-- <h1>App Name + logo</h1> -->
  </div>
  <ul class="right">
    <li>Donate</li>
    <li>Icon Credits</li>
    <li>
      <a href="https://github.com/dowinterfor6/video-converter/issues">
        Report a bug
      </a>
    </li>
  </ul>
</nav>
