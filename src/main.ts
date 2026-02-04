import { mount } from "svelte";
import "./app.css";
import App from "./App.svelte";
import { whenOdysseyLoaded } from "@abcnews/env-utils";
import Timeout from "await-timeout";

let app: any;

async function waitForOdysseyWithTimeout() {
  return Timeout.wrap(whenOdysseyLoaded, 1000, "Timed out waiting for Odyssey");
}

const init = async () => {
  await waitForOdysseyWithTimeout();
  app = mount(App, {
    target: document.querySelector(".Header")!,
  });
};

init();

export default app;
