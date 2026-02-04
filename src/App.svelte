<script lang="ts">
  import Portal from "svelte-portal";
  import Header from "./components/Header.svelte";
</script>

<Portal target=".Header">
  <Header></Header>
</Portal>

<style lang="scss">
</style>
