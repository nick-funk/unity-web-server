import React from "react";
import * as ReactDOMClient from "react-dom/client";

import { App } from "./app";

const run = async () => {
  const appElement = document.getElementById("app");
  if (!appElement) {
    console.error("unable to find app element");
    return;
  }

  const root = ReactDOMClient.createRoot(appElement);
  root.render(<App />)
};

document.addEventListener("DOMContentLoaded", () => {
  void run();
});
