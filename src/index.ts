import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/model/basketModel';
import { BasketView } from './components/view/basketView';
import { CatalogModel } from './components/model/catalogModel';
import { CatalogView } from './components/view/catalogView';
import { CatalogItemView } from './components/view/catalogItemView';
import { BASE_URL } from './utils/constants';
import { ShopApi } from './components/shopApi';
import { ModalView } from './components/view/modalView';
import { CardPreviewView } from './components/view/cardPreviewView';
import { ContactsFormView } from './components/view/contactsFormView';
import { OrderView } from './components/view/orderView';
import { OrderSuccessView } from './components/view/orderSuccessView';
import { BasketItemView } from './components/view/basketItemView';
import { OrderModel } from './components/model/orderModel';
import { IOrder, IProduct } from "./types";

const api: ShopApi = new ShopApi(BASE_URL, {});
const events: EventEmitter = new EventEmitter();

// TEMPLATES
const catalogItemTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');
const basketItemTemplate: HTMLTemplateElement = document.querySelector(
	'#card-basket'
) as HTMLTemplateElement;

// MODEL
const basketModel: BasketModel = new BasketModel(events);
const catalogModel: CatalogModel = new CatalogModel(events);
const orderModel: OrderModel = new OrderModel();

// VIEW
const modalView: ModalView = new ModalView(
	document.querySelector('#modal-container'),
	events
);
const basketView: BasketView = new BasketView(
	document.querySelector('.basket'),
	events
);
const catalogView: CatalogView = new CatalogView(
	document.querySelector('.gallery')
);
const cardPreviewView: CardPreviewView = new CardPreviewView(
	document.querySelector('.card_full'),
	events,
	basketModel
);
const orderView: OrderView = new OrderView(
	document.querySelector('#order').querySelector('.form'),
	events
);
const contactsFormView: ContactsFormView = new ContactsFormView(
	document.querySelector('#contacts').querySelector('.form'),
	events
);
const orderSuccessView: OrderSuccessView = new OrderSuccessView(
	document.querySelector('.order-success'),
	events
);

events.on('basket:change', (event: { items: string[] }): void => {
	basketView.render({
		size: event.items.length,
		price: basketModel.getBasketPrice(catalogModel),
	});
});

events.on('catalog:change', (event: { items: string[] }): void => {
	catalogView.render({
		items: event.items.map((id: string) => {
			const itemView: CatalogItemView = new CatalogItemView(
				id,
				catalogItemTemplate,
				events
			);
			return itemView.render(catalogModel.getProduct(id));
		}),
	});
});

events.on('ui:basket-add', (event: { id: string }): void => {
	const product = catalogModel.getProduct(event.id);
	basketModel.add(product.id);
	const basketItemView = new BasketItemView(
		product.id,
		basketItemTemplate,
		events
	);
	basketView.itemsView.set(product.id, basketItemView);
	basketView.addItem(
		basketItemView.render({
			id: product.id,
			title: product.title,
			price: product.price,
		})
	);
});

events.on(
	'ui:contacts-validate',
	(event: {
		button: HTMLButtonElement;
		emailInput: HTMLInputElement;
		phoneInput: HTMLInputElement;
	}) => {
		const emailValid: boolean = orderModel.validateEmail(
			event.emailInput.value
		);
		const phoneValid: boolean = orderModel.validatePhone(
			event.phoneInput.value
		);

		event.button.disabled = !emailValid || !phoneValid;
	}
);

events.on('ui:basket-remove', (event: { id: string }): void => {
	basketView.itemsView.get(event.id).remove();
	basketView.itemsView.delete(event.id);
	basketModel.remove(event.id);
	modalView.render({
		content: basketView.render({
			size: basketModel.items.length,
			price: basketModel.getBasketPrice(catalogModel),
		}),
	});
});

events.on('ui:modal-close', (): void => {
	modalView.close();
});

events.on('ui:basket-click', (): void => {
	modalView.render({
		content: basketView.render({
			size: basketModel.items.length,
			price: basketModel.getBasketPrice(catalogModel),
		}),
	});
	basketView.setBasketListIndex();
	modalView.open();
});

events.on('ui:basket-click-order', (): void => {
	const items: string[] = [];

	basketModel.items.forEach((id) => items.push(id));

	orderModel.setTotal(basketModel.getBasketPrice(catalogModel));
	orderModel.setItems(items);

	modalView.render({ content: orderView.render() });
});

events.on('ui:catalog-click', (event: { id: string }): void => {
	const product = catalogModel.getProduct(event.id);
	modalView.render({
		content: cardPreviewView.render({
			image: product.image,
			category: product.category,
			title: product.title,
			text: product.text,
			price: product.price,
			id: product.id,
		}),
	});
	modalView.open();
});

events.on('ui:order', (data: { address: string; payment: string }): void => {
	orderModel.setAddress(data.address);
	orderModel.setPayment(data.payment);
	modalView.render({ content: contactsFormView.render() });
});

events.on(
	'ui:contacts-order',
	(data: { email: string; phone: string }): void => {
		orderModel.setEmail(data.email);
		orderModel.setPhone(data.phone);
		const order: IOrder = orderModel.getOrder();
		api
			.order(order)
			.then((res) => {
				if (res) {
					modalView.render({
						content: orderSuccessView.render({ price: order.total }),
					});
					basketModel.items.splice(0, basketModel.items.length);
					basketView.itemsView.clear();
					basketView.reset();
				} else {
					modalView.close();
				}
			})
			.catch((res) => {
				console.log(res);
			});
	}
);

api
	.loadProductList()
	.then((res) => {
		res.items.forEach((product: IProduct) => {
			catalogModel.addItem(product.id, product);
		});
	})
	.catch((res) => {
		console.log(res);
	});
