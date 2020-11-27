<script>
  export let video;
</script>

<section class="input-container">
  <input type="file" on:change="{(e) => video = e.target.files?.item(0)}">
</section>

<style type="text/scss">
  $color: #ff0000;

  .input-container {
    background: $color;
  }
</style>