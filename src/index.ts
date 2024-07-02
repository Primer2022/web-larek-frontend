import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { BasketModel } from "./components/model/basketmodel";
import { BasketView } from "./components/view/basketview";
import { CatalogModel } from "./components/model/catalogmodel";
import { BasketItemView } from "./components/view/basketitemview";
import { Api } from "./components/base/api";

const api = new Api("", {});
const events: EventEmitter = new EventEmitter();
const basketView: BasketView = new BasketView(document.querySelector('.basket'));
const basketModel: BasketModel = new BasketModel(events);
const catalogModel: CatalogModel = new CatalogModel(events);

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

events.on('basket:change', (event: { items: string[] }): void => {
	renderBasket(event.items);
})

events.on('ui:basket-add', (event: { id: string }): void => {
	basketModel.add(event.id);
})

events.on('ui:basket-remove', (event: { id: string }): void => {
	basketModel.remove(event.id);
})

