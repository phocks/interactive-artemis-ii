<script lang="ts">
  import { fade } from 'svelte/transition';
  import DepthGauge from './DepthGauge.svelte';
  import PressureGauge from './PressureGauge.svelte';
  import { LIMIT } from '../lib/constants';

  export let distance: number;
  $: visible = true || distance > 85 && distance < LIMIT;
</script>

{#if visible}
  <div class="gauge" class:bottom={distance >= LIMIT - 1} transition:fade>
    <DepthGauge {distance} />
    <!-- <PressureGauge pressure={distance / 10} /> -->
  </div>
{/if}

<style>
  .gauge {
    font-family: var(--dls-font-stack-sans);
    position: fixed;
    bottom: 20vh;
    height: 1px;
    background: rgba(255, 255, 255, 0.5);
    width: 100vw;
  }
  .bottom {
    position: absolute;
    bottom: 0;
  }
</style>
