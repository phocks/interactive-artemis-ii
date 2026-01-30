<script lang="ts">
  import { ROWS } from '../lib/constants';

  export let distance: number;
  const formatter = new Intl.NumberFormat();
  let pressureInAtmospheres: number;

  $: pressureInAtmospheres = distance / 10;
</script>

<div class="depth-indicator" style="--threshold: {(100 / ROWS) * 2}vh;">
  <div class="label">DISTANCE</div>
  <div class="pressure">
    <!-- <span class="number">{formatter.format(Math.round(pressureInAtmospheres))}</span> atmospheres -->
  </div>
  <div><span class="number">{formatter.format(Math.round(distance))}</span> kms</div>
</div>

<style>
  .depth-indicator {
    color: #fff;
    /* background-color: #dadada; */
    width: 250px;
    position: absolute;
    left: calc(50% + 34px);
    top: 50%;
    /* transform: translate(-50%, -50%); */
    padding: 0.5em 0.5em 0.5em 50px;
    font-size: 0.875em;
    font-weight: bold;
    line-height: 1.5;
  }
  .label {
    margin-bottom: -5px;
    font-size: 1em;
    font-weight: bolder;
  }
  .pressure {
    font-size: 1.4em;
  }

  .number {
    font-family: var(--dls-font-stack-monospace);
  }
</style>
