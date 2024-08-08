import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/model/basketmodel';
import { BasketView } from './components/view/basketview';
import { CatalogModel } from './components/model/catalogmodel';
import { BasketItemView } from './components/view/basketitemview';
import { Api } from './components/base/api';
import { Catalogview } from './components/view/catalogview';
import { Catalogitemview } from './components/view/catalogitemview';
import { Ordermodel } from './components/model/ordermodel';

const api = new Api('', {});
const events: EventEmitter = new EventEmitter();
const basketView: BasketView = new BasketView(
	document.querySelector('.basket')
);
const basketModel: BasketModel = new BasketModel(events);
const catalogModel: CatalogModel = new CatalogModel(events);
const catalogView: Catalogview = new Catalogview(
	document.querySelector('.gallery__item')
);

function renderBasket(items: string[]) {
	basketView.render({
		items: items.map((id: string) => {
			const itemView: BasketItemView = new BasketItemView(
				this.container,
				events
			);
			return itemView.render(catalogModel.getProduct(id));
		}),
	});
}

function renderCatalog(items: string[]) {
	catalogView.render({
		items: items.map((id: string) => {
			const itemView: Catalogitemview = new Catalogitemview(
				this.container,
				events
			);
			return itemView.render(catalogModel.getProduct(id));
		}),
	});
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
});

events.on('ui:catalog-click', (event: { id: string }): void => {
	basketModel.add(event.id);
});

events.on('ui:order', (event: { payMethod: string; address: string }): void => {
	// TODO OPEN CONTACTS MODAL
});

events.on(
	'ui:contacts-order',
	(event: { email: string; phone: string; order: Ordermodel }): void => {
		// TODO ORDER
	}
);
