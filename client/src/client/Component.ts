import { v4 as uuid } from "uuid";

export class Component {
  protected id: string;

  public readonly root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;

    this.id = uuid();
  }

  public clear() {
    this.root.innerHTML = "";
  }

  public appendChild(child: Component | HTMLElement) {
    if (child instanceof Component) {
      this.root.appendChild(child.root);
    }

    if (child instanceof HTMLElement) {
      this.root.appendChild(child);
    }
  }
}