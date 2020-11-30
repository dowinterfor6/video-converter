<script>
  import { demuxingFormats, muxingFormats } from "../variables";
  import {
    video,
    fileFormat,
    fileInputError,
    dropdownInputError,
  } from "../store/store";

  let videoName, fileError, dropdownError, format;

  fileFormat.subscribe((value) => (format = value));

  fileInputError.subscribe((err) => {
    fileError = err;
  });

  dropdownInputError.subscribe((err) => {
    dropdownError = err;
  });

  video.subscribe((video) => {
    videoName = video.name;
  });

  let fileInputHover = false;
  let dropdownActive;
  let dropdownSearchQuery = format;

  const commonFileFormats = [
    ".mp4",
    ".mov",
    ".flv",
    ".avi",
    ".webm",
    ".mkv",
    ".gif",
    ".mp3",
  ];

  const muxFormats = muxingFormats.filter(
    (format) => !commonFileFormats.includes(format)
  );

  $: filteredFileFormats = [
    "Common",
    ...commonFileFormats,
    "Other",
    ...muxFormats,
  ].filter((format) => format.includes(dropdownSearchQuery));

  const highlight = (e) => {
    fileInputHover = true;
    e.preventDefault();
    e.stopPropagation();
  };

  const unhighlight = (e) => {
    fileInputHover = false;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    highlight(e);
  };

  const handleDragOver = (e) => {
    highlight(e);
  };

  const handleDragLeave = (e) => {
    unhighlight(e);
  };

  const handleDragDrop = (e) => {
    unhighlight(e);
    const data = e.dataTransfer;
    const file = data.files?.item(0);
    validateFile(file);
  };

  const handleFileInputChange = (e) => {
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
    } else if (file.size / 1024 / 1024 / 1024 >= 2) {
      fileInputError.set("Error: File exceeded 2gb size limit");
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

    if ([...muxFormats, ...commonFileFormats].includes(dropdownSearchQuery)) {
      dropdownActive = false;
      fileFormat.set(dropdownSearchQuery);
    } else {
      dropdownActive = true;
      dropdownInputError.set("Not a valid file format");
    }
  };

  const setDropdownValue = (e) => {
    dropdownInputError.set("");
    dropdownSearchQuery = e.currentTarget.dataset.format;
    fileFormat.set(e.currentTarget.dataset.format);
    dropdownActive = false;
  };
</script>

<style lang="scss">
  @import "../style/global.scss";

  $dropdownWidth: 200px;
  $dropdownHeight: 50px;
  $errorColor: rgb(255, 86, 86);

  .animate__shakeX {
    -webkit-animation-name: shakeX;
    animation-name: shakeX;
    animation-duration: 0.3s;
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
      border: 1px solid #ccc;
      border-radius: 2px;
      padding: 7.5px;
      height: 300px;
      width: 600px;
      margin-bottom: 10px;
      transition: all 0.3s;

      &:hover {
        background-color: $grey;
        color: $blue;
      }

      .file-upload-wrapper {
        border: 1px dashed #ccc;
        height: 100%;
        width: 100%;

        &.highlight {
          border-color: green;
          background: green;
        }

        label {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;

          .error-message {
            color: $errorColor;
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
          z-index: -1;
        }
      }
    }

    .dropdown-container {
      width: $dropdownWidth;
      height: $dropdownHeight;
      position: relative;

      .error-message {
        color: $errorColor;
      }

      ul {
        z-index: 5;
        max-height: 200px;
        width: $dropdownWidth;
        overflow-y: auto;
        overflow-x: hidden;
        border: 1px solid #ccc;
        border-radius: 2px;
        cursor: pointer;
        padding: 0;
        color: $dark-blue;
        user-select: none;
        position: relative;
        top: -1px;
        margin: 0;
        display: none;
        background: white;

        &.open {
          display: inherit;
        }

        li {
          list-style: none;
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
        border: 1px solid #ccc;
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
          transition: all 0.2s;
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

<section class="input-container">
  <div
    class="file-upload-container"
    class:animate__shakeX={fileError}
    onanimationend={(e) => e.currentTarget.classList.remove('animate__shakeX')}>
    <div
      class="file-upload-wrapper"
      class:highlight={fileInputHover}
      on:dragenter={handleDragEnter}
      on:dragleave={handleDragLeave}
      on:dragover={handleDragOver}
      on:drop={handleDragDrop}>
      <input
        id="file-input"
        type="file"
        on:change={handleFileInputChange}
        accept={demuxingFormats.join(', ')} />
      <label for="file-input">
        {#if videoName}
          <span>{videoName}</span>
        {:else if fileError}
          <span class="error-message">{fileError}</span>
        {:else}<span>Choose a video or drag it here</span>{/if}
      </label>
    </div>
  </div>

  <div class="dropdown-container" class:animate__shakeX={dropdownError}>
    {#if dropdownError}<span class="error-message">{dropdownError}</span>{/if}
    <form class="searchable-dropdown" on:submit={handleDropdownBlur}>
      <input
        type="text"
        value={format}
        on:input={handleDropdownSearch}
        on:focus={handleDropdownOpen}
        on:blur={handleDropdownBlur} />
      <div
        class:flipped={dropdownActive}
        on:click={() => (dropdownActive = !dropdownActive)}>
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
