<script>
  import { fly, fade } from "svelte/transition";

  let sandwichOpen = false;

  const navLinks = [
    {
      text: "Buy me a coffee!",
      href: "https://www.buymeacoffee.com/achan",
      type: "link"
    },
    {
      text: "Credits",
      items: [
        {
          href: "https://www.flaticon.com/authors/monkik",
          title: "monkik",
          text: "Favicon - monkik"
        },
        {
          href: "https://www.flaticon.com/authors/pixel-perfect",
          title: "Pixel perfect",
          text: "Download icon - Pixel perfect"
        },
        {
          href: "https://www.flaticon.com/authors/becris",
          title: "Becris",
          text: "Convert icon - Becris"
        },
        {
          href: "https://www.flaticon.com/authors/smashicons",
          title: "Smashicons",
          text: "Down arrow icon - Smashicons"
        },
        {
          href: "https://www.flaticon.com/authors/freepik",
          title: "Freepik",
          text: "Close icon - Freepik"
        },
        {
          href: "https://codepen.io/Paolo-Duzioni/pen/ZoRabJ",
          title: "Paolo Duzioni",
          text: "Loading spinner - Paolo Duzioni"
        }
      ],
      type: "dropdown"
    },
    {
      text: "Report a bug",
      href: "https://github.com/dowinterfor6/video-converter/issues",
      type: "link"
    },
    {
      text: "Github",
      href: "https://github.com/dowinterfor6/video-converter/",
      type: "link"
    }
  ];

  const toggleSandwichOpen = () => {
    sandwichOpen = !sandwichOpen;
  };

  const closeSandwich = () => {
    sandwichOpen = false;
  };
</script>

<nav>
  <div class="sandwich" role="button">
    <span on:click={toggleSandwichOpen}>☰</span>
    {#if sandwichOpen}
      <div
        class="sandwich-wrapper"
        class:open={sandwichOpen}
        transition:fade={{ duration: 300 }}
        on:click={closeSandwich}>
        <ul
          class="sandwich-contents"
          on:click={(e) => e.stopPropagation()}
          transition:fly={{ x: -270, duration: 300 }}>
          {#each navLinks as link}
            {#if link.type === 'dropdown'}
              <li class="dropdown">
                {link.text}
                <ul>
                  {#each link.items as dropdownItems}
                    <li>
                      <a
                        href={dropdownItems.href}
                        title={dropdownItems.title}
                        target="_blank"
                        rel="noreferrer">
                        {dropdownItems.text}
                      </a>
                    </li>
                  {/each}
                </ul>
              </li>
            {:else}
              <li>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.text}
                </a>
              </li>
            {/if}
          {/each}
        </ul>
      </div>
    {/if}
  </div>
  <div class="left">
    <!-- <h1>App Name + logo</h1> -->
  </div>
  <ul class="right">
    {#each navLinks as link}
      {#if link.type === 'dropdown'}
        <li class="dropdown">
          {link.text}
          <ul>
            {#each link.items as dropdownItems}
              <li>
                <a
                  href={dropdownItems.href}
                  title={dropdownItems.title}
                  target="_blank"
                  rel="noreferrer">
                  {dropdownItems.text}
                </a>
              </li>
            {/each}
          </ul>
        </li>
      {:else}
        <li>
          <a href={link.href} target="_blank" rel="noreferrer"> {link.text} </a>
        </li>
      {/if}
    {/each}
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
    width: 100%;
    max-width: $extra-large-screen;
    padding: 5px 10px 0 10px;
    top: 0;

    .sandwich {
      display: block;

      span {
        position: absolute;
        z-index: 15;
        cursor: pointer;
        font-size: 26px;
      }

      .sandwich-wrapper {
        display: none;
        position: absolute;
        height: 100vh;
        width: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 10;
        color: $dark-blue;
        margin: 0;

        &.open {
          display: block;
          position: absolute;
        }

        .sandwich-contents {
          margin: 0;
          padding: 50px 0 0 0;
          width: 270px;
          max-width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: white;

          li {
            // &:first-of-type {
            //   border-top: 1px solid $medium-grey;
            // }

            // border-bottom: 1px solid $medium-grey;
            cursor: pointer;
            display: flex;
            justify-content: center;
            padding: 10px 0;

            &:hover {
              background: $grey;
              color: $blue;
            }

            a {
              width: 100%;
              height: 100%;
              color: $dark-blue;
              text-decoration: none;

              &:hover {
                color: $blue;
              }
            }

            &.dropdown {
              display: flex;
              flex-direction: column;

              ul {
                max-height: 0;
                overflow: hidden;
                transition: all $short-anim-duration;

                li {
                  &:first-of-type {
                    border-top: none;
                  }

                  &:last-of-type {
                    padding-bottom: 0;
                    border-bottom: none;
                  }
                }
              }

              &:hover ul {
                margin-top: 10px;
                max-height: 500px;
              }
            }
          }
        }
      }
    }

    .right {
      display: none;
      justify-content: flex-end;
      color: $dark-blue;
      cursor: pointer;

      li {
        text-align: center;
        margin: 0 15px;

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
          transform: translateX(-$dropdown-element-padding);

          li {
            text-align: left;
            padding: $dropdown-element-padding;
            margin: 0;

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

    @media only screen and (min-width: $medium-screen) {
      width: 80%;
      padding: 5px 30px 0 30px;

      .sandwich {
        display: none;
      }

      .right {
        display: flex;
      }
    }
  }
</style>
