<script>
  import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
  import { fade, draw } from "svelte/transition";
  import ProgressBar from "./ProgressBar.svelte";

  import {
    video,
    fileFormat,
    fileInputError,
    dropdownInputError,
  } from "../store/store";

  let videoFile, fileError, dropdownError, format;
  let prevVideoFile, prevFormat;

  fileFormat.subscribe((value) => (format = value));

  fileInputError.subscribe((err) => {
    fileError = err;
  });

  dropdownInputError.subscribe((err) => {
    dropdownError = err;
  });

  video.subscribe((video) => {
    videoFile = video;
  });

  let progress = 0;
  let output, isConverting;

  $: errors = fileError || dropdownError;
  $: inputOrFormatChanged =
    prevVideoFile !== videoFile || prevFormat !== format;
  $: showConvertButton =
    videoFile.name && !errors && !isConverting && inputOrFormatChanged;
  $: showDownloadButton = output && !inputOrFormatChanged;

  const ffmpeg = createFFmpeg({
    log: true,
    progress: ({ ratio }) => {
      if (ratio >= 0) {
        progress = (ratio * 100.0).toFixed(2);
      }
    },
  });

  const convert = async () => {
    const { name } = videoFile;

    isConverting = true;

    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    ffmpeg.FS("writeFile", name, await fetchFile(videoFile));

    // Assume file format is correct, in the form .format
    const fileFormatWithoutDot = format.split(".")[1];

    await ffmpeg.run(
      "-i",
      name,
      "-f",
      `${fileFormatWithoutDot}`,
      `out.${fileFormatWithoutDot}`
    );

    const data = ffmpeg.FS("readFile", `out.${fileFormatWithoutDot}`);
    const url = URL.createObjectURL(new Blob([data.buffer]), {
      type: `video/${fileFormatWithoutDot}`,
    });

    output = url;
    isConverting = false;
    prevVideoFile = videoFile;
    prevFormat = format;
  };
</script>

<style lang="scss">
  @import "../style/global.scss";

  @mixin button($strokeWidth) {
    width: 250px;
    padding: 10px 20px;
    background-color: $light-blue;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s;
    text-decoration: none;
    color: black;
    margin: auto;
    position: absolute;
    // Container Width / 2 - Button Width / 2
    left: calc(50% - 125px);

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
      height: 30px;
      width: 30px;
      margin-right: 10px;

      svg {
        margin: auto;
        overflow: initial;

        path {
          transition: all 0.3s;
          stroke: black;
          stroke-width: $strokeWidth;
          fill: transparent;
        }
      }
    }

    span {
      font-size: 24px;
      text-transform: uppercase;
      font-family: "Montserrat", sans-serif;
      font-weight: 100;
      color: inherit;
    }
  }

  .interactables-container {
    position: relative;
    margin-top: 40px;
    width: $interactablesContainerWidth; // Same as input?
    height: inherit; // Temp solution

    .convert-container {
      @include button(10px);
    }

    .download-container {
      @include button(20px);
    }
  }
</style>

<section class="interactables-container">
  {#if showConvertButton}
    <div
      class="convert-container"
      transition:fade={{ duration: 200, delay: 400 }}
      on:click={convert}>
      <div>
        <svg
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="30px"
          height="30px"
          style="enable-background:new 0 0 75.716 75.716;"
          xml:space="preserve"
          viewBox="150 70 350 350">
          <g>
            <g>
              <path
                transition:draw={{ duration: 1000 }}
                d="M472.897,124.269c-0.01-0.01-0.02-0.02-0.03-0.031l-0.017,0.017l-68.267-68.267c-6.78-6.548-17.584-6.36-24.132,0.42
                c-6.388,6.614-6.388,17.099,0,23.713l39.151,39.151h-95.334c-65.948,0.075-119.391,53.518-119.467,119.467
                c-0.056,47.105-38.228,85.277-85.333,85.333h-102.4C7.641,324.072,0,331.713,0,341.139s7.641,17.067,17.067,17.067h102.4
                c65.948-0.075,119.391-53.518,119.467-119.467c0.056-47.105,38.228-85.277,85.333-85.333h95.334l-39.134,39.134
                c-6.78,6.548-6.968,17.353-0.419,24.132c6.548,6.78,17.353,6.968,24.132,0.419c0.142-0.137,0.282-0.277,0.419-0.419l68.267-68.267
                C479.54,141.748,479.553,130.942,472.897,124.269z" />
            </g>
          </g>
          <g>
            <g>
              <path
                transition:draw={{ duration: 1000 }}
                d="M472.897,329.069c-0.01-0.01-0.02-0.02-0.03-0.03l-0.017,0.017l-68.267-68.267c-6.78-6.548-17.584-6.36-24.132,0.42
                c-6.388,6.614-6.388,17.099,0,23.712l39.151,39.151h-95.334c-20.996,0.015-41.258-7.721-56.9-21.726
                c-7.081-6.222-17.864-5.525-24.086,1.555c-6.14,6.988-5.553,17.605,1.319,23.874c21.898,19.614,50.269,30.451,79.667,30.43h95.334
                l-39.134,39.134c-6.78,6.548-6.968,17.352-0.42,24.132c6.548,6.78,17.352,6.968,24.132,0.42c0.142-0.138,0.282-0.277,0.42-0.42
                l68.267-68.267C479.54,346.548,479.553,335.742,472.897,329.069z" />
            </g>
          </g>
          <g>
            <g>
              <path
                transition:draw={{ duration: 1000 }}
                d="M199.134,149.702c-21.898-19.614-50.269-30.451-79.667-30.43h-102.4C7.641,119.272,0,126.913,0,136.339
                c0,9.426,7.641,17.067,17.067,17.067h102.4c20.996-0.015,41.258,7.721,56.9,21.726c7.081,6.222,17.864,5.525,24.086-1.555
                C206.593,166.588,206.006,155.971,199.134,149.702z" />
            </g>
          </g>
        </svg>
      </div>
      <span>Convert</span>
    </div>
  {/if}
  {#if isConverting}
    <ProgressBar bind:progress />
  {/if}
  {#if showDownloadButton}
    <a
      href={output}
      download={`${videoFile.name?.split('.')[0]}${format}`}
      class="download-container"
      transition:fade={{ duration: 200, delay: 400 }}>
      <div>
        <svg
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 10 500 500"
          style="enable-background:new 0 0 512 512;"
          xml:space="preserve"
          width="30px"
          height="30px">
          <g>
            <g>
              <path
                transition:draw={{ duration: 1000 }}
                d="M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64
                c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472
                c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z" />
            </g>
          </g>
          <g>
            <g>
              <path
                transition:draw={{ duration: 1000 }}
                d="M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z" />
            </g>
          </g>
        </svg>
      </div>
      <span>Download</span>
    </a>
  {/if}
</section>
