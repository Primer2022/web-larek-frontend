import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/model/basketModel';
import { BasketView } from './components/view/basketView';
import { CatalogModel } from './components/model/catalogModel';
import { CatalogView } from './components/view/catalogView';
import { CatalogItemView } from './components/view/catalogItemView';
import { BASE_URL } from './utils/constants';
import { ShopApi } from './components/shopApi';
import { IOrder, IProduct } from './types';
import { Modal } from './components/model/modal';
import { ModalView } from './components/view/modalView';
import { CardPreviewView } from './components/view/cardPreviewView';
import { ContactsFormView } from './components/view/contactsFormView';
import { OrderView } from './components/view/orderView';
import { OrderSuccessView } from './components/view/orderSuccessView';

const api: ShopApi = new ShopApi(BASE_URL, {});
const events: EventEmitter = new EventEmitter();

// MODEL
const basketModel: BasketModel = new BasketModel(events);
const catalogModel: CatalogModel = new CatalogModel(events);
const modal: Modal = new Modal(
	document.querySelector('#modal-container'),
	events
);

// TEMPLATES
const catalogItemTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');
const basketItemTemplate: HTMLTemplateElement = document.querySelector(
	'#card-basket'
) as HTMLTemplateElement;

// VIEW
const modalView: ModalView = new ModalView(
	document.querySelector('#modal-container'),
	events
);
const basketView: BasketView = new BasketView(
	document.querySelector('.basket'),
	events,
	basketItemTemplate
);
const catalogView: CatalogView = new CatalogView(
	document.querySelector('.gallery')
);
const cardPreviewView: CardPreviewView = new CardPreviewView(
	document.querySelector('.card_full'),
	events,
	catalogModel
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

function setBasketListIndex() {
	const basketItems: string[] = Array.from(basketModel.items.keys());
	const items: Map<number, string> = new Map();
	for (let i = 0; i < basketItems.length; i++) {
		items.set(i + 1, basketItems[i]);
	}
	basketView.setListIndex(items);
}

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
				events,
				catalogModel
			);
			return itemView.render(catalogModel.getProduct(id));
		}),
	});
});

events.on('ui:basket-add', (event: { id: string }): void => {
	basketModel.add(catalogModel.getProduct(event.id));
	basketView.setPrice(basketModel.getBasketPrice(catalogModel));
	if (basketModel.items.get(event.id).amount === 1) {
		basketView.addItem(basketModel.items.get(event.id));
	}
});

events.on('ui:basket-remove', (event: { id: string }): void => {
	if (basketModel.items.get(event.id).amount === 1) {
		basketView.removeItem(event.id);
	}
	basketModel.remove(event.id);
	setBasketListIndex();
	basketView.setPrice(basketModel.getBasketPrice(catalogModel));
});

events.on('ui:modal-close', (): void => {
	modal.close();
});

events.on('ui:basket-click', (): void => {
	modalView.render({
		content: basketView.render({
			size: basketModel.items.size,
			price: basketModel.getBasketPrice(catalogModel),
		}),
	});
	setBasketListIndex();
	modal.open();
});

events.on('ui:basket-click-order', (): void => {
	const items: string[] = [];

	basketModel.items.forEach((item, id) => {
		for (let i = 0; i < item.amount; i++) items.push(id);
	});

	modalView.render({
		content: orderView.render({
			total: basketModel.getBasketPrice(catalogModel),
			address: null,
			email: null,
			payment: 'card',
			items: items,
			phone: null,
		}),
	});
	modal.open();
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
	modal.open();
});

events.on('ui:order', (order: IOrder): void => {
	modalView.render({
		content: contactsFormView.render(order),
	});
	modal.open();
});

events.on('ui:contacts-order', (order: IOrder): void => {
	api
		.order(order)
		.then((res) => {
			if (res) {
				modalView.render({
					content: orderSuccessView.render({ price: order.total }),
				});
				modal.open();
				basketView.render({
					size: 0,
					price: 0,
				});
			} else {
				modal.close();
			}
		})
		.catch((res) => {
			modal.close();
			console.log(res);
		});
});

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
