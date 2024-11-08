import { IView } from '../../types';

export class CatalogView implements IView {
	constructor(protected container: HTMLElement) {}

	render(data?: { items: HTMLElement[] }): HTMLElement {
		if (data) {
			this.container.append(...data.items);
		}
		return this.container;
	}
}
