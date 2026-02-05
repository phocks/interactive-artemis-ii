<script lang="ts">
  import Portal from "svelte-portal";
  import Header from "./components/Header.svelte";
  import Stage from "./components/Stage.svelte";
  import {
    loadDarkModeObserver,
    unloadDarkModeObserver,
    setMode,
  } from "./lib/darkModeSwitcher";

  $effect(() => {
    setMode(document.body.getAttribute("data-scheme") as string);
    loadDarkModeObserver();
    return () => unloadDarkModeObserver();
  });
</script>

<Portal target=".Header">
  <Header></Header>
</Portal>

<Portal target="[data-key='body']">
  <Stage></Stage>
</Portal>

<style lang="scss"></style>
