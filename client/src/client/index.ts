import { makeRequest } from "./api";
import { App } from "./app";

const run = async () => {
  const root = document.getElementById("app");
  if (!root) {
    return;
  }

  new App(root);
};

document.addEventListener("DOMContentLoaded", () => {
  void run();
});
