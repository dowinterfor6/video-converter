<script>
  export let video;
  export let fileFormat;

  $: videoName = video?.name;

  let fileInputHover = false;
  let error = "";

  const fileFormats = ["avi", "flv", "m4v", "webm", "mkv", "mov", "mp4", "m4a", "3gp", "mpeg", "ogg"];
  const nonVideoFileFormats = ["gif", "mp3"];

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
    if (file.type.split("/")[0] !== "video") {
      error = "Invalid file type, please select a video!";
    } else {
      error = "";
      video = file;
    }
  }
</script>

<!-- TODO Separate error into own class for easier red warning styling -->
<!-- TODO: Max file size 2gb -->

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
      <input id="file-input" type="file" on:change={handleFileInputChange} accept={`video/*, .mkv`}>
      <label
        for="file-input"
      >
        {#if videoName}
          {videoName}
        {:else}
          {error || "Choose a video or drag it here"}
        {/if}
      </label>
    </div>
  </div>

  <select on:change={(e) => fileFormat = e.currentTarget.value}>
    {#each fileFormats as format}
      <option value={format}>
        .{format}
      </option>
    {/each}
    <option disabled>Other</option>
    {#each nonVideoFileFormats as format}
      <option value={format}>
        .{format}
      </option>
    {/each}
  </select>
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

    select {
      border: 1px solid #ccc;
      border-radius: 2px;
      cursor: pointer;
      padding: 5px;
      color: $dark-blue;
      user-select: none;
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