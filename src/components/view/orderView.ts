import { IEventEmmiter, IOrder, IView } from '../../types';

export class OrderView implements IView {
	protected payMethod: string;
	protected address: HTMLInputElement;
	protected orderButton: HTMLButtonElement;
	protected orderButtons: HTMLButtonElement[] = [];
	protected order: IOrder;

	constructor(
		protected container: HTMLElement,
		protected events: IEventEmmiter
	) {
		container
			.querySelector('.order__buttons')
			.querySelectorAll('.button')
			.forEach((button) => {
				this.orderButtons.push(button as HTMLButtonElement);
				button.addEventListener('click', (event) => {
					const button = event.target as HTMLButtonElement;
					if (!button.classList.contains('button_alt-active')) {
						this.orderButtons.forEach((button) => {
							button.classList.remove('button_alt-active');
						});
						button.classList.add('button_alt-active');
						this.payMethod = button.name;
					}
				});
			});

		this.address = container.querySelector('.form__input[name="address"]');
		this.orderButton = container
			.querySelector('.modal__actions')
			.querySelector('.button');

		this.address.addEventListener('input', (event) => {
			const input = event.target as HTMLInputElement;
			this.orderButton['disabled'] = input.value == '';
		});

		this.orderButton.addEventListener('click', () => {
			this.order.address = this.address.value;
			events.emit('ui:order', this.order);
		});
	}

	reset(): void {
		this.payMethod = '';
		this.address.value = '';

		this.orderButtons.forEach((button) => {
			if (button.name === this.order.payment) {
				button.classList.add('button_alt-active');
			} else {
				button.classList.remove('button_alt-active');
			}
		});
	}

	render(order: IOrder): HTMLElement {
		if (order) {
			this.order = order;
		}

		this.reset();
		return this.container;
	}
}
