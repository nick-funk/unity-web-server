import { makeRequest } from "./api";
import { Component } from "./Component";
import { getFloatValue, getIntegerValue } from "./form";

export class MoveObjectForm extends Component {
  private onSubmitDelegate: (e: Event) => void;

  constructor() {
    super(document.createElement("div"));

    this.onSubmitDelegate = this.onSubmit.bind(this);

    this.render();
  }

  private objectId(): number {
    return getIntegerValue(`${this.id}-objectId`);
  }

  private x(): number {
    return getFloatValue(`${this.id}-x`);
  }

  private y(): number {
    return getFloatValue(`${this.id}-y`);
  }

  private z(): number {
    return getFloatValue(`${this.id}-z`);
  }

  private setMessage(message: string) {
    const el = document.getElementById(`${this.id}-message`);
    if (!el) {
      return;
    }

    el.innerHTML = message;
  }

  private onSubmit = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    const response = await makeRequest("/api/command/MoveObject", "POST", {
      id: this.objectId(),
      x: this.x(),
      y: this.y(),
      z: this.z(),
    });

    if (response.ok) {
      const json = await response.json();

      if (json.success) {
        this.setMessage(`${json.message}: ${json.id}`);
      } else {
        this.setMessage(json.message);
      }
    }
  }

  public render() {
    this.clear();

    const title = document.createElement("div");
    title.innerHTML = "Move Object:"
    this.appendChild(title);

    const form = document.createElement("form");
    form.innerHTML = `
      <label for="objectId">Id:</label>
      <input type="text" name="objectId" id="${this.id}-objectId" />
      <label for="x">X:</label>
      <input type="text" name="x" id="${this.id}-x" />
      <label for="y">Y:</label>
      <input type="text" name="y" id="${this.id}-y" />
      <label for="z">Z:</label>
      <input type="text" name="z" id="${this.id}-z" />
    `

    const submitButton = document.createElement("button");
    submitButton.value = "Move";
    submitButton.innerText = "Move";
    submitButton.onclick = this.onSubmitDelegate;

    form.appendChild(submitButton);

    this.appendChild(form);

    const message = document.createElement("div");
    message.id = `${this.id}-message`;
    message.innerHTML = "";

    this.appendChild(message);
  }
}