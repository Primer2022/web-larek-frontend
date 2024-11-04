import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/model/basketmodel';
import { BasketView } from './components/view/basketview';
import { CatalogModel } from './components/model/catalogmodel';
import { CatalogView } from './components/view/catalogview';
import { CatalogItemView } from './components/view/catalogitemview';
import { BASE_URL } from './utils/constants';
import { ShopApi } from './components/ShopApi';
import { ProductList } from './components/base/productlist';
import { CardPreviewModal } from './components/view/modal/cardpreviewmodal';
import { BasketModal } from './components/view/modal/basketmodal';
import { OrderFormModal } from './components/view/modal/orderformmodal';
import { ContactsFormModal } from './components/view/modal/contactsformmodal';
import { OrderSuccessModal } from './components/view/modal/ordersuccessmodal';
import { IOrder, IProduct } from "./types";

const api: ShopApi = new ShopApi(BASE_URL, {});
const events: EventEmitter = new EventEmitter();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const productList: ProductList = await api.getProductList();

// TEMPLATES
const catalogItemTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');
const catalog: HTMLElement = document.querySelector('#gallery');

// MODEL
const basketModel: BasketModel = new BasketModel(events);
const catalogModel: CatalogModel = new CatalogModel(events);

// MODAL
const cardPreviewModal: CardPreviewModal = new CardPreviewModal(
	document.querySelector('#modal-container'),
	document.querySelector('#card-preview'),
	events
);

const basketModal: BasketModal = new BasketModal(
	document.querySelector('#modal-container'),
	document.querySelector('#basket'),
	events
);

const orderFormModal: OrderFormModal = new OrderFormModal(
	document.querySelector('#modal-container'),
	document.querySelector('#order'),
	events);

const contactsFormModal: ContactsFormModal = new ContactsFormModal(
	document.querySelector('#modal-container'),
	document.querySelector('#contacts'),
	events);

const orderSuccessModal: OrderSuccessModal = new OrderSuccessModal(
	document.querySelector('#modal-container'),
	document.querySelector('#success'),
	events);

// VIEW
const basketView: BasketView = new BasketView(
	document.querySelector('.basket'),
	events
);
const catalogView: CatalogView = new CatalogView(
	document.querySelector('.gallery')
);

function renderBasket(items: string[]) {
	basketView.render({
		size: items == null || items.length < 1 ? 0 : items
			.map((id: string) => basketModel.items.get(id))
			.reduce((a, b) => a + b),
	});
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

function openBasket() {
	basketModal.open();
	renderBasketModal();
}

function renderBasketModal() {
	const itemsModal: Map<IProduct, number> = new Map();
	basketModel.items.forEach((amount, id) => {
		itemsModal.set(catalogModel.items.get(id), basketModel.getProductPrice(id, catalogModel.getProduct(id).price));
	})
	basketModal.fill(itemsModal, basketModel.getBasketPrice(catalogModel));
}

events.on('basket:change', (event: { items: string[] }): void => {
	renderBasket(event.items);
});

events.on('catalog:change', (event: { items: string[] }): void => {
	renderCatalog(event.items);
});

events.on('ui:basket-add', (event: { id: string }): void => {
	basketModel.add(event.id);
});

events.on('ui:basket-remove', (event: { id: string }): void => {
	basketModel.remove(event.id);
	renderBasketModal();
});

events.on('ui:basket-click', (): void => {
	openBasket();
});

events.on('ui:basket-click-order', (): void => {
	const items: string[] = [];

	basketModel.items.forEach((amount, id) => {
		for (let i = 0; i < amount; i++) {
			items.push(id);
		}
	})

	const order: IOrder = {total: basketModel.getBasketPrice(catalogModel), address: null, email: null, payment: null, items: items, phone: null};
	orderFormModal.open();
	orderFormModal.addEventListeners(order);
});

events.on('ui:catalog-click', (event: { id: string }): void => {
	cardPreviewModal.open();
	cardPreviewModal.fill(catalogModel.getProduct(event.id));
});

events.on('ui:order', (order: IOrder): void => {
	contactsFormModal.open();
	contactsFormModal.addEventListeners(order);
});

events.on(
	'ui:contacts-order',
	(order: IOrder): void => {
		api.order(order);
		orderSuccessModal.open();
		orderSuccessModal.fill(basketModel.getBasketPrice(catalogModel));
		basketModel.items.clear();
	}
);

productList.items.forEach((item) => {
	catalogModel.addItem(item.id, item);
	events.emit('catalog:change', {
		items: Array.from(catalogModel.items.keys()),
	});
});
