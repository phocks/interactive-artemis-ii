<script lang="ts">
  import Block from './Block.svelte';
  import OceanGrid from './OceanGrid.svelte';
  export let blocks: import('..').Block[];
</script>

<OceanGrid>
  {#each blocks as block}
    <Block {...block} />
  {/each}
</OceanGrid>

<style></style>
