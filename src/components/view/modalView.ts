import { IEventEmmiter, IView } from "../../types";

export class ModalView implements IView {

  protected closeButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: IEventEmmiter) {
    this.closeButton = container.querySelector('.modal__close');
    this.closeButton.addEventListener('click', () => {
      events.emit('ui:modal-close', {});
    })
  }

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
    document.removeEventListener('keydown', (e) => {
      if (e.key === "Escape") {
        this.close();
      }
    })
    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  render(data?: { content: HTMLElement }): HTMLElement {
    if (data) {
      const modalContent = this.container.querySelector('.modal__content');
      modalContent.replaceChildren(data.content);
    }
    return this.container;
  }
}
