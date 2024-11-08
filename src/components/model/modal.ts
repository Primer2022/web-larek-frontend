import { IEventEmmiter } from "../../types";

export class Modal {

  constructor(protected container: HTMLDivElement, protected events: IEventEmmiter) {}

  open(): void {
    this.container.classList.add('modal_active');
    document.onkeydown = e => {
      if (e.key === "Escape") {
        this.close();
      }
    }

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }
}