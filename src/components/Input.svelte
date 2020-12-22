<script>
  import { demuxingFormats, muxingFormats } from "../variables";
  import {
    video,
    fileFormat,
    fileInputError,
    dropdownInputError,
    isFileConverting
  } from "../store/store";

  let videoName,
    fileError,
    dropdownError,
    format,
    isConverting,
    fileInputHover = false,
    dropdownActive;

  fileFormat.subscribe((value) => (format = value));

  fileInputError.subscribe((err) => (fileError = err));

  dropdownInputError.subscribe((err) => (dropdownError = err));

  video.subscribe((video) => (videoName = video.name));

  isFileConverting.subscribe((val) => (isConverting = val));

  let dropdownSearchQuery = format;

  const commonFileFormats = [
    ".mp4",
    ".mov",
    ".flv",
    ".avi",
    ".webm",
    ".mkv",
    ".gif",
    ".mp3"
  ];

  const muxFormats = muxingFormats.filter(
    (format) => !commonFileFormats.includes(format)
  );

  $: filteredFileFormats = [
    "Common",
    ...commonFileFormats,
    "Other",
    ...muxFormats
  ].filter((format) => format.includes(dropdownSearchQuery));

  const handleDragIn = (e) => {
    e.preventDefault();
    if (isConverting) return;
    fileInputHover = true;
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    if (isConverting) return;
    fileInputHover = false;
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isConverting) return;
    fileInputHover = false;
    const data = e.dataTransfer;
    const file = data.files?.item(0);
    validateFile(file);
  };

  const handleFileInputChange = (e) => {
    if (isConverting) return;
    const file = e.currentTarget.files?.item(0);
    validateFile(file);
  };

  const validateFile = (file) => {
    if (!file) return;

    const fileNameSplit = file.name.split(".");
    if (
      file.type.split("/")[0] !== "video" ||
      !demuxingFormats.includes(`.${fileNameSplit[fileNameSplit.length - 1]}`)
    ) {
      fileInputError.set("Error: Invalid file type");
      video.set({});
    } else if (file.size / 1024 / 1024 / 1024 >= 2) {
      fileInputError.set("Error: File exceeded 2GB size limit");
      video.set({});
    } else {
      fileInputError.set("");
      video.set(file);
    }
  };

  const handleDropdownSearch = (e) => {
    dropdownSearchQuery = e.currentTarget.value;
    dropdownInputError.set("");
  };

  const handleDropdownOpen = () => {
    dropdownActive = true;
  };

  const handleDropdownBlur = (e) => {
    e.preventDefault();

    fileFormat.set(dropdownSearchQuery);
    if ([...muxFormats, ...commonFileFormats].includes(dropdownSearchQuery)) {
      dropdownActive = false;
      dropdownInputError.set("");
    } else {
      dropdownActive = true;
      dropdownInputError.set("Not a valid file format");
    }
  };

  const setDropdownValue = (e) => {
    dropdownInputError.set("");
    dropdownSearchQuery = e.currentTarget.dataset.format;
    fileFormat.set(dropdownSearchQuery);
    dropdownActive = false;
  };
</script>

<section class="input-container">
  <div class="file-upload-container">
    <div
      class="file-upload-wrapper"
      class:shakeAnimX={fileError}
      class:highlight={fileInputHover}
      onanimationend={(e) => e.currentTarget.classList.remove('shakeAnimX')}
      on:dragenter={handleDragIn}
      on:dragleave={handleDragOut}
      on:dragover={handleDragIn}
      on:drop={handleDragDrop}>
      <input
        id="file-input"
        type="file"
        disabled={isConverting}
        on:change={handleFileInputChange}
        accept={demuxingFormats.join(', ')} />
      <label for="file-input">
        {#if videoName}
          <span>{videoName}</span>
        {:else if fileError}
          <span class="error-message">{fileError}</span>
        {:else}
          <span class="desktop-input-msg">Drop your file here or
            <b>browse</b></span>
          <span class="mobile-input-msg"><b>Browse</b></span>
        {/if}
        <span class="file-size-limit">File size limit: 2 GB</span>
      </label>
    </div>
  </div>

  <div class="dropdown-container" class:shakeAnimX={dropdownError}>
    <label for="dropdown-search-box" class="dropdown-label">
      {#if dropdownError}
        <span class="error-message">{dropdownError}</span>
      {:else}<span>Search for a format:</span>{/if}
    </label>
    <form class="searchable-dropdown" on:submit={handleDropdownBlur}>
      <input
        id="dropdown-search-box"
        type="text"
        value={dropdownSearchQuery}
        disabled={isConverting}
        on:input={handleDropdownSearch}
        on:focus={handleDropdownOpen}
        on:blur={handleDropdownBlur} />
      <div
        class:flipped={dropdownActive}
        on:click={() => {
          if (!isConverting) {
            dropdownActive = !dropdownActive;
          }
        }}>
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 -60 512 512"
          width="20px"
          height="30px"
          xml:space="preserve">
          <g>
            <g>
              <path
                d="M505.752,123.582c-8.331-8.331-21.839-8.331-30.17,0L256,343.163L36.418,123.582c-8.331-8.331-21.839-8.331-30.17,0
                s-8.331,21.839,0,30.17l234.667,234.667c8.331,8.331,21.839,8.331,30.17,0l234.667-234.667
                C514.083,145.42,514.083,131.913,505.752,123.582z" />
            </g>
          </g>
        </svg>
      </div>
    </form>
    <ul class:open={dropdownActive}>
      {#each filteredFileFormats as format}
        {#if format.includes('.')}
          <li data-format={format} on:mousedown={setDropdownValue}>{format}</li>
        {:else}
          <li class="disabled">{format}</li>
        {/if}
      {/each}
    </ul>
  </div>
</section>

<style lang="scss">
  @import "../style/global.scss";

  $dropdownWidth: 200px;
  $dropdownHeight: 50px;

  .shakeAnimX {
    -webkit-animation-name: shakeX;
    animation-name: shakeX;
    animation-duration: $short-anim-duration;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: $dark-blue;

    input {
      margin: 0;
      height: 50px;
    }

    .file-upload-container {
      margin-bottom: 30px;
      transition: all $short-anim-duration;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: white;
      max-width: 500px;
      width: 90%;

      &:hover {
        background-color: $grey;
        color: $blue;
      }

      .file-upload-wrapper {
        border: 5px dashed $border-grey;
        width: 100%;
        height: 150px;

        &.highlight {
          background-color: $input-green;
          color: $blue;
        }

        label {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          justify-content: center;
          user-select: none;
          font-size: 20px;

          span:not(.file-size-limit) {
            max-width: 90%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin: 20px 0;
          }

          .error-message {
            color: $errorColor;
          }

          .file-size-limit {
            font-size: 16px;
          }

          .desktop-input-msg {
            display: none;
          }

          .mobile-input-msg {
            display: block;
          }
        }

        input {
          padding: 0;
          margin: 0;
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
          overflow: hidden;
          position: absolute;
          z-index: -5;
        }
      }
    }

    .dropdown-container {
      background-color: white;
      width: $dropdownWidth;
      position: relative;

      .dropdown-label {
        span {
          position: absolute;
          left: 0;
          top: -20px;
          width: 100%;
        }

        .error-message {
          color: $errorColor;
        }
      }

      ul {
        z-index: 5;
        max-height: 100px;
        width: $dropdownWidth;
        overflow-y: auto;
        overflow-x: hidden;
        border: 1px solid $border-grey;
        border-radius: 2px;
        cursor: pointer;
        padding: 0;
        color: $dark-blue;
        user-select: none;
        position: absolute;
        transform: translateY(-1px);
        margin: 0;
        display: none;
        background: white;

        &.open {
          display: inherit;
        }

        li {
          padding: 5px 0;

          &.disabled {
            color: grey;
          }

          &:hover:not(.disabled) {
            background-color: $grey;
          }

          &.disabled {
            cursor: initial;
          }
        }
      }

      .searchable-dropdown {
        border: 1px solid $border-grey;
        border-radius: 2px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        div {
          height: $dropdownHeight;
          display: flex;
          flex-direction: column;
          justify-content: center;
          cursor: pointer;
          padding: 0 5px;
          transition: all $short-anim-duration;
          margin: 0 5px;

          &.flipped {
            transform: rotate(180deg);
          }
        }

        input {
          border: 0;
          width: 100%;
          padding: 5px 7.5px;

          &:focus {
            outline: none;
          }
        }
      }
    }

    @media only screen and (min-width: $medium-screen) {
      .file-upload-container {
        width: 70%;

        .file-upload-wrapper {
          width: 100%;
          height: 250px;

          label {
            font-size: 24px;

            .desktop-input-msg {
              display: block;
            }

            .mobile-input-msg {
              display: none;
            }
          }
        }
      }
    }

    @media only screen and (min-width: $large-screen) {
      .file-upload-container {
        width: 100%;

        .file-upload-wrapper {
          height: 250px;
          width: 500px;

          label {
            font-size: 28px;

            .desktop-input-msg {
              display: block;
            }

            .mobile-input-msg {
              display: none;
            }
          }
        }
      }
    }
  }

  @keyframes shakeX {
    from,
    to {
      transform: translate3d(0, 0, 0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translate3d(-5px, 0, 0);
    }

    20%,
    40%,
    60%,
    80% {
      transform: translate3d(5px, 0, 0);
    }
  }
</style>
