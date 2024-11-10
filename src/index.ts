import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/model/basketModel';
import { BasketView } from './components/view/basketView';
import { CatalogModel } from './components/model/catalogModel';
import { CatalogView } from './components/view/catalogView';
import { CatalogItemView } from './components/view/catalogItemView';
import { BASE_URL } from './utils/constants';
import { ShopApi } from './components/shopApi';
import { IBasketListItem, IOrder, IProduct } from "./types";
import { Modal } from './components/base/modal';
import { ModalView } from './components/view/modalView';
import { CardPreviewView } from './components/view/cardPreviewView';
import { ContactsFormView } from './components/view/contactsFormView';
import { OrderView } from './components/view/orderView';
import { OrderSuccessView } from './components/view/orderSuccessView';
import { OrderPresenter } from "./components/model/orderPresenter";
import { BasketItemView } from "./components/view/basketItemView";

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
const modal: Modal = new Modal(
	document.querySelector('#modal-container'),
	events
);
const orderPresenter: OrderPresenter = new OrderPresenter();
// const basketPresenter: BasketPresenter = new BasketPresenter(events, basketItemTemplate, basketModel);

// VIEW
const modalView: ModalView = new ModalView(
	document.querySelector('#modal-container'),
	events
);
const basketView: BasketView = new BasketView(
	document.querySelector('.basket'),
	events,
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
	const itemsView = this.basketModel.itemsView;
	const itemsId: string[] = Array.from(itemsView.keys());
	for (let i = 0; i < itemsId.length; i++) {
		const id = itemsId[i];
		itemsView.get(id).setItemIndex(i+1)
	}
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
				events
			);
			return itemView.render(catalogModel.getProduct(id));
		}),
	});
});

events.on('ui:basket-add', (event: { id: string }): void => {
	basketModel.add(catalogModel.getProduct(event.id));
	basketView.setPrice(basketModel.getBasketPrice(catalogModel));
	if (basketModel.items.get(event.id).amount === 1) {
		const item: IBasketListItem = basketModel.items.get(event.id);
		const basketItemView = new BasketItemView(
			item.product.id,
			basketItemTemplate,
			events
		);
		basketModel.itemsView.set(item.product.id, basketItemView);
		basketView.addItem(basketItemView.render({
			id: item.product.id,
			title: item.product.title,
			price: item.product.price,
		}))
	}
});

events.on('ui:basket-remove', (event: { id: string }): void => {
	if (basketModel.items.get(event.id).amount === 1) {
		basketModel.itemsView.get(event.id).remove();
		basketModel.itemsView.delete(event.id);
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

	orderPresenter.setTotal(basketModel.getBasketPrice(catalogModel));
	orderPresenter.setItems(Array.from(basketModel.items.keys()));

	modalView.render({
		content: orderView.render(),
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

events.on('ui:order', (data: { address: string, payment: string }): void => {
	orderPresenter.setAddress(data.address);
	orderPresenter.setPayment(data.payment);
	modalView.render({
		content: contactsFormView.render(),
	});
	modal.open();
});

events.on('ui:contacts-order', (data: {email: string, phone: string}): void => {
	orderPresenter.setEmail(data.email);
	orderPresenter.setPhone(data.phone);
	const order: IOrder = orderPresenter.getOrder();
	api
		.order(order)
		.then((res) => {
			if (res) {
				modalView.render({
					content: orderSuccessView.render({ price: order.total }),
				});
				modal.open();
				basketView.reset();
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
