<script lang="ts">
  import Rocket from "./Rocket.svelte";
</script>

<div class="stage-root">
  <Rocket />
</div>

<style lang="scss">
  .stage-root {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    // background-image: radial-gradient(
    //   circle,
    //   rgb(129, 43, 43),
    //   rgb(103, 103, 70),
    //   rgb(22, 64, 22)
    // );
    z-index: -1;
  }
</style>
