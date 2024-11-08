import { IEventEmmiter, IOrder, IView } from "../../types";

export class ContactsFormView implements IView {
	protected email: HTMLInputElement;
	protected phone: HTMLInputElement;
	protected orderButton: HTMLButtonElement;
	protected order: IOrder;

	constructor(
		protected container: HTMLElement,
		protected events: IEventEmmiter
	) {
		this.email = container.querySelector('.form__input[name="email"]');
		this.phone = container.querySelector('.form__input[name="phone"]');
		this.orderButton = container.querySelector('.button');

		this.email.addEventListener('input', () => {
			this.orderButton.disabled = !this.valid();
		});

		this.phone.addEventListener('input', () => {
			this.orderButton.disabled = !this.valid();
		});

		this.orderButton.addEventListener('click', (event) => {
			event.preventDefault();
			this.order.email = this.email.value;
			this.order.phone = this.phone.value;
			this.events.emit('ui:contacts-order', this.order);
		});
	}

	protected valid(): boolean {
		return (
			this.email.validity.valid && this.phone.validity.valid
		);
	}

	reset(): void {
		this.email.value = "";
		this.phone.value = "";
	}

	render(order: IOrder): HTMLElement {
		if(order) {
			this.order = order;
		}

		this.reset();
		return this.container;
	}
}
