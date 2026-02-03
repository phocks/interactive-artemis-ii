import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { whenOdysseyLoaded } from "@abcnews/env-utils";

// Odyssey format required
await whenOdysseyLoaded;

const app = mount(App, {
  target: document.querySelector(".Header")!,
});

export default app;
