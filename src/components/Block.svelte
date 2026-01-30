<script lang="ts">
  import { depth as depthPixels } from '../lib/stores';
  import { COLUMNS, ROWS_PER_METRE, SCREENS, TITANIC } from '../lib/constants';
  import BlockImage from './BlockImage.svelte';
  import type { BlockImage as BlockImageType } from '../index';

  export let width: number | 'max' | undefined;
  export let align: 'bottom' | 'top';
  export let depth: number = 0;
  export let elements: (HTMLElement | BlockImageType)[];

  let position: string;
  let deep = false;
  $: deep = depth > 3000;
  $: position =
    align === 'top'
      ? `top: calc(${(depth / TITANIC) * SCREENS} * 100vh - 70vh)`
      : `bottom: calc(${(1 - depth / TITANIC) * SCREENS} * 100vh)`;
</script>

<div class="block u-layout" class:deep={depth > 3000} style={position}>
  <div class=" u-richtext">
    {#if $depthPixels}
      {#each elements as child}
        {#if child instanceof HTMLElement}
          {@html child.outerHTML}
        {:else}
          <BlockImage {align} {width} sizes={`${100}vw`} {...child} />
        {/if}
      {/each}
    {/if}
  </div>
</div>

<style>
  .block {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
  }

  .block > :global([class*='u-richtext'] > p) {
    color: #fff;
  }
</style>
