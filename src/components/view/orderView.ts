import { IEventEmmiter, IView } from '../../types';

export class OrderView implements IView {
	protected payMethod: string;
	protected address: string;
	protected orderButton: HTMLButtonElement;

	constructor(
		protected container: HTMLElement,
		protected events: IEventEmmiter
	) {
		container
			.querySelector('.order__buttons')
			.querySelectorAll('.button')
			.forEach((button: HTMLButtonElement) => {
				if (button.classList.contains('button_alt-active')) {
					this.payMethod = button.name;
				}
			});

		this.address = container.querySelector(
			'.form__input[name="address"]'
		).textContent;
		this.orderButton = container.querySelector('.order__button');

		this.orderButton.addEventListener('click', () => {
			events.emit('ui:order', {
				payMethod: this.payMethod,
				address: this.address,
			});
		});
	}

	render(data?: { payMethod: string; address: string }): HTMLElement {
		if (data) {
			this.payMethod = data.payMethod;
			this.address = data.address;
		}
		return this.container;
	}
}
