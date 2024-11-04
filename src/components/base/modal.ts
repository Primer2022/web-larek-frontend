import { IEventEmmiter, IOrder } from "../../types";

export class Modal {
  protected closeButton: HTMLButtonElement;
  protected modal: HTMLDivElement;

  constructor(protected container: HTMLElement, protected template: HTMLTemplateElement, protected events: IEventEmmiter) {
  }

  render(): void {
    this.modal = this.template.content.cloneNode(true) as HTMLDivElement;
    this.closeButton = this.container.querySelector('.modal__close');
    this.container.querySelector('.modal__content').replaceChildren(this.modal);
  }

  open(): void {
    this.render();
    this.closeButton.addEventListener('click', event => this.close())
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
    this.closeButton.removeEventListener('click', event => this.close())
    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }
}