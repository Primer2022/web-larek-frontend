import { IEventEmmiter, IView } from "../../types";

export class ModalView implements IView {

  protected closeButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: IEventEmmiter) {
    this.closeButton = container.querySelector('.modal__close');
    this.closeButton.addEventListener('click', () => {
      events.emit('ui:modal-close', {});
    })
  }

  render(data?: { content: HTMLElement }): HTMLElement {
    if (data) {
      const modalContent = this.container.querySelector('.modal__content');
      modalContent.replaceChildren(data.content);
    }
    return this.container;
  }
}
