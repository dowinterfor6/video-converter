<script>
  export let video;
  export let fileFormat;

  // TODO: Reset state on input change
  // TODO: Name output file same as input
  // TODO: Manage state of whatever button/progress is loaded
  // TODO: Credit icon authors

  import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
  import { fade, draw } from 'svelte/transition';
  import ProgressBar from './ProgressBar.svelte';
  
  const convertIconDimension = 75.761;
  let progress = 0;
  let output, isConverting;

  const ffmpeg = createFFmpeg({
    log: true, 
    progress: ({ ratio }) => {
      if (ratio >= 0) {
        progress = (ratio * 100.0).toFixed(2);
      }
    }
  });

	const convert = async () => {
    // TODO: Check max file size here and prevent running if file too large
    // TODO: Check if input file type is correct
    const { name, size } = video;
    console.log(fileFormat);
		console.log(`${name}, ${size / 1024} kb`);

		isConverting = true;

		if (!ffmpeg.isLoaded()) {
			await ffmpeg.load();
		}

		ffmpeg.FS('writeFile', name, await fetchFile(video));

    await ffmpeg.run('-i', name, '-f', `${fileFormat}`, `out.${fileFormat}`);

		const data = ffmpeg.FS('readFile', `out.${fileFormat}`);
		const url = URL.createObjectURL(new Blob([data.buffer]), { type: `video/${fileFormat}` });

		output = url;
		isConverting = false;
  }
</script>

<section class="interactables-container">
  {#if video.name}
    <div class="button-container" transition:fade={{ duration: 300 }} on:click={convert}>
      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      width="75.716px" height="75.716px" style="enable-background:new 0 0 75.716 75.716;"
      xml:space="preserve" viewBox={`0 0 ${convertIconDimension} ${convertIconDimension}`}>
        <g>
          <path transition:draw={{ duration: 2000 }} d="M16.075,62.145L0,46.07h9.969c1.756-18.33,12.763-32.017,25.911-32.017c1.792,0,3.577,0.256,5.31,0.764l3.853,1.121
            l-3.853,1.119c-9.79,2.847-17.455,14.68-18.908,29.011h9.867L16.075,62.145z M5.639,48.406l10.436,10.436l10.437-10.436H19.75
            l0.093-1.257c1.065-14.151,7.624-25.904,16.788-30.745C24.22,15.856,13.56,29.327,12.209,47.324l-0.082,1.079L5.639,48.406
            L5.639,48.406z M39.832,61.661c-1.789,0-3.571-0.255-5.307-0.764l-3.852-1.12l3.852-1.12c9.792-2.847,17.457-14.679,18.909-29.011
            h-9.87l16.077-16.075l16.075,16.075h-9.971C63.988,47.975,52.98,61.661,39.832,61.661z M39.083,59.31
            c0.247,0.012,0.499,0.016,0.747,0.016c12.169,0,22.345-13.299,23.675-30.938l0.082-1.079h6.483L59.632,16.873L49.193,27.309h6.766
            l-0.094,1.257C54.805,42.715,48.244,54.469,39.083,59.31z"/>
        </g>
      </svg>
      <button>Convert</button>
    </div>
  {/if}
  {#if isConverting}
    <ProgressBar bind:progress/>
  {/if}
  {#if output}
    <a href={output} download={`download.${fileFormat}`} class="download-container" transition:fade={{ duration: 300 }}>
      <div>
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 -100 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
          <g>
            <g>
              <path transition:draw={{duration: 2000}} d="M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64
                c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472
                c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z"/>
            </g>
          </g>
          <g>
            <g>
              <path transition:draw={{duration: 2000}} d="M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z"/>
            </g>
          </g>
        </svg>
      </div>
      <span>Download</span>
    </a>
  {/if}
</section>

<style lang="scss">
  @import "./style/global.scss";

  .interactables-container {
    margin-top: 40px;

    .button-container {
      width: 255px;
      padding: 5px 10px;
      background-color: $light-blue;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: $blue;
        color: white;

        svg {
          path {
            stroke: white;
          }
        }
      }

      svg {
        margin-right: 5px;

        path {
          transition: all 0.3s;
          stroke: black;
          fill: transparent;
        }
      }

      button {
        cursor: pointer;
        background: none;
        border: none;
        outline: none;
        font-size: 28px;
        text-transform: uppercase;
        font-family: Montserrat, sans-serif;
        font-weight: 100;
        color: inherit;
      }
    }

    .download-container {
      width: 255px;
      padding: 5px 10px;
      background-color: $light-blue;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
      color: black;

      &:hover {
        background-color: $blue;
        color: white;

        svg {
          path {
            stroke: white;
          }
        }
      }

      div {
        height: 60px;
        width: 60px;
        margin-right: 10px;

        svg {
          margin: auto;
          overflow: initial;

          path {
            transition: all 0.3s;
            stroke: black;
            stroke-width: 20px;
            fill: transparent;
          }
        }
      }

      span {
        font-size: 28px;
        text-transform: uppercase;
        font-family: Montserrat, sans-serif;
        font-weight: 100;
        color: inherit;
      }
    }
  }
</style>