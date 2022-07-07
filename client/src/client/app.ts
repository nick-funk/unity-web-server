import { Component } from "./Component";
import { MoveObjectForm } from "./moveObjectForm";
import { SpawnObjectForm } from "./spawnObjectForm";

export class App extends Component {
  constructor(element: HTMLElement) {
    super(element);

    this.render();
  }

  public render() {
    this.clear();

    this.appendChild(new SpawnObjectForm());
    this.appendChild(new MoveObjectForm());
  }
}