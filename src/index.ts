import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/model/basketModel';
import { BasketView } from './components/view/basketView';
import { CatalogModel } from './components/model/catalogModel';
import { CatalogView } from './components/view/catalogView';
import { CatalogItemView } from './components/view/catalogItemView';
import { BASE_URL } from './utils/constants';
import { ShopApi } from './components/shopApi';
import { ProductList } from './components/base/productList';
import { CardPreviewModal } from './components/view/modal/cardPreviewModal';
import { BasketModal } from './components/view/modal/basketModal';
import { OrderFormModal } from './components/view/modal/orderFormModal';
import { ContactsFormModal } from './components/view/modal/contactsFormModal';
import { OrderSuccessModal } from './components/view/modal/orderSuccessModal';
import { IOrder } from './types';

const api: ShopApi = new ShopApi(BASE_URL, {});
const events: EventEmitter = new EventEmitter();

// MODEL
const basketModel: BasketModel = new BasketModel(events);
const catalogModel: CatalogModel = new CatalogModel(events);

// TEMPLATES
const catalogItemTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');
const catalog: HTMLElement = document.querySelector('#gallery');

// MODAL
const cardPreviewModal: CardPreviewModal = new CardPreviewModal(
	document.querySelector('#card-preview'),
	events
);

const basketModal: BasketModal = new BasketModal(
	document.querySelector('#basket'),
	events
);

const orderFormModal: OrderFormModal = new OrderFormModal(
	document.querySelector('#order'),
	events
);

const contactsFormModal: ContactsFormModal = new ContactsFormModal(
	document.querySelector('#contacts'),
	events
);

const orderSuccessModal: OrderSuccessModal = new OrderSuccessModal(
	document.querySelector('#success'),
	events
);

// VIEW
const basketView: BasketView = new BasketView(
	document.querySelector('.basket'),
	events
);
const catalogView: CatalogView = new CatalogView(
	document.querySelector('.gallery')
);

function renderBasket(size: number) {
	basketView.render({
		size: size,
	});
	basketModal.setPrice(basketModel.getBasketPrice(catalogModel));
}

function renderCatalog(items: string[]) {
	catalogView.render({
		items: items.map((id: string) => {
			const itemView: CatalogItemView = new CatalogItemView(
				id,
				catalogItemTemplate,
				events
			);
			return itemView.render(catalog, catalogModel.getProduct(id));
		}),
	});
}

function setBasketListIndex() {
	const basketItems: string[] = Array.from(basketModel.items.keys());
	const items: Map<number, string> = new Map();
	for (let i = 0; i < basketItems.length; i++) {
		items.set(i + 1, basketItems[i]);
	}
	basketModal.setListIndex(items);
}

events.on('basket:change', (event: { items: string[] }): void => {
	renderBasket(event.items.length);
});

events.on('catalog:change', (event: { items: string[] }): void => {
	renderCatalog(event.items);
});

events.on('ui:basket-add', (event: { id: string }): void => {
	basketModel.add(catalogModel.getProduct(event.id));
	basketModal.setPrice(basketModel.getBasketPrice(catalogModel));
	if (basketModel.items.get(event.id).amount === 1) {
		basketModal.addItem(basketModel.items.get(event.id));
	}
	setBasketListIndex();
});

events.on('ui:basket-remove', (event: { id: string }): void => {
	if (basketModel.items.get(event.id).amount === 1) {
		basketModal.removeItem(event.id);
	}
	basketModel.remove(event.id);
	setBasketListIndex();
	basketModal.setPrice(basketModel.getBasketPrice(catalogModel));
});

events.on('ui:basket-click', (): void => {
	basketModal.open();
});

events.on('ui:basket-click-order', (): void => {
	const items: string[] = [];

	basketModel.items.forEach((item, id) => {
		for (let i = 0; i < item.amount; i++) {
			items.push(id);
		}
	});

	const order: IOrder = {
		total: basketModel.getBasketPrice(catalogModel),
		address: null,
		email: null,
		payment: null,
		items: items,
		phone: null,
	};
	orderFormModal.open();
	orderFormModal.setOrder(order);
	orderFormModal.reset();
});

events.on('ui:catalog-click', (event: { id: string }): void => {
	cardPreviewModal.open();
	cardPreviewModal.fill(catalogModel.getProduct(event.id));
});

events.on('ui:order', (order: IOrder): void => {
	contactsFormModal.open();
	contactsFormModal.setOrder(order);
	contactsFormModal.reset();
});

events.on('ui:contacts-order', (order: IOrder): void => {
	api
		.order(order)
		.then((res) => {
			if (res) {
				contactsFormModal.close();
				orderSuccessModal.open();
				orderSuccessModal.setPrice(basketModel.getBasketPrice(catalogModel));
				renderBasket(0);
			}
		})
		.catch(() => {
			contactsFormModal.close();
		});
});

await api.loadProductList(catalogModel);