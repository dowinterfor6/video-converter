<script>
  export let video;
  export let fileFormat;

  import { demuxingFormats, muxingFormats } from "./variables";

  $: videoName = video?.name;

  let fileInputHover = false;
  let error = "";
  let selectRef;

  const commonFileFormats = ["mp4", "mov", "flv", "avi", "webm", "mkv", "gif", "mp3"];

  const muxFormats = muxingFormats.filter((format) => !commonFileFormats.includes(format));

  const highlight = (e) => {
    fileInputHover = true;
    e.preventDefault();
    e.stopPropagation();
  }

  const unhighlight = (e) => {
    fileInputHover = false;
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDragEnter = (e) => {
    highlight(e);
  }

  const handleDragOver = (e) => {
    highlight(e);
  }

  const handleDragLeave = (e) => {
    unhighlight(e);
  }

  const handleDragDrop = (e) => {
    unhighlight(e);
    const data = e.dataTransfer;
    const file = data.files?.item(0);
    validateFile(file);
  }

  const handleFileInputChange = (e) => {
    const file = e.currentTarget.files?.item(0);
    validateFile(file);
  }

  const validateFile = (file) => {
    if (!file) return;

    if (file.type.split("/")[0] !== "video") {
      error = "Error: Invalid file type";
    } else if (file.size / 1024 / 1024 / 1024 >= 2) {
      error = "Error: File exceeded 2gb size limit";
    } else {
      error = "";
      video = file;
    }
  }

  const handleDropdownSearch = () => {
    selectRef.focus();
  }
</script>

<section class="input-container">
  <div class="file-upload-container" class:animate__shakeX={error} onanimationend={(e) => e.currentTarget.classList.remove("animate__shakeX")}>
    <div
      class="file-upload-wrapper"
      class:highlight={fileInputHover}
      on:dragenter={handleDragEnter}
      on:dragleave={handleDragLeave}
      on:dragover={handleDragOver}
      on:drop={handleDragDrop}
    >
      <input id="file-input" type="file" on:change={handleFileInputChange} accept={demuxingFormats.map((format) => `.${format}`).join(", ")}>
      <label
        for="file-input"
      >
        {#if videoName}
          <span>{videoName}</span>
        {:else}
          {#if error}
            <span class="error-message">{error}</span>
          {:else}
            <span>Choose a video or drag it here</span>
          {/if}
        {/if}
      </label>
    </div>
  </div>

  <div class="dropdown-container">
    <input class="searchable-dropdown" type="text" value={`.${fileFormat}`} on:change={handleDropdownSearch}>
    <select bind:this={selectRef} on:change={(e) => fileFormat = e.currentTarget.value}>
      {#each commonFileFormats as format}
        <option value={format}>
          .{format}
        </option>
      {/each}
      <option disabled>Other formats</option>
      {#each muxFormats as format}
        <option value={format}>
          .{format}
        </option>
      {/each}
    </select>
  </div>
</section>

<style lang="scss">
  @import "./style/global.scss";

  .input-container {
    display: flex;
    justify-content: center;
    align-items: center;
    color: $dark-blue;
    
    input, select {
      margin: 0;
      height: 50px;
    }
    
    .file-upload-container {
      border: 1px solid #ccc;
      border-radius: 2px;
      padding: 7.5px;
      height: 100px;
      width: 300px;
      margin-right: 10px;
      transition: all 0.3s;

      &.animate__shakeX {
        -webkit-animation-name: shakeX;
        animation-name: shakeX;
        animation-duration: 0.3s;
      }
      
      &:hover {
        background-color: rgb(252, 252, 252);
        color: $blue;
      }

      .file-upload-wrapper {
        border: 1px dashed #ccc;
        height: 100%;
        width: 100%;

        &.highlight {
          border-color: green;
          background: green
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
            color: rgb(255, 149, 149);
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
      width: 170px;
      height: 50px;
      position: relative;

      select {
        border: 1px solid #ccc;
        border-radius: 2px;
        cursor: pointer;
        padding: 5px;
        color: $dark-blue;
        user-select: none;
      }

      .searchable-dropdown {
        border: 0;
        padding: 5px 7.5px;
        width: 150px;
        height: 46px;
        position: absolute;
        top: 2px;
        left: 2.5px;

        &:focus {
          outline: none;
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