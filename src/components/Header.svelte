<script lang="ts">
  import { untrack } from "svelte";

  $effect(() => {
    untrack(() => {
      console.log("onMount");
    });
  });
</script>

<style lang="scss">
  :global {
    .Header {
      height: 100dvh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .Header-content {
        margin-inline: 16px;
      }

      .Header-content h1 {
        font-size: 3.2rem !important;
        color: var(--interactive-color-header);
        text-align: center;
      }

      .Header-byline > ul {
        justify-content: center;
      }

      .Header-meta > div {
        justify-content: center;
      }
    }
  }
</style>
