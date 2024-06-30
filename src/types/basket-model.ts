import { EventEmitter } from "../components/base/events";
import { IView } from "./view"

interface IBasketModel {
    items: Map<string, number>;
    add(id: string) : void;
    remove(id: string) : void;
}

class BasketModel implements IBasketModel {
    constructor(protected events: EventEmitter) {}

    items: Map<string, number>;

    add(id: string): void {
        if(!this.items.has(id)) this.items.set(id, 0);
        this.items.set(id, this.items.get(id) + 1);
        this._changed();
    }

    remove(id: string): void {
        if(!this.items.has(id)) return;
        if(this.items.get(id) > 0) {
            this.items.set(id, this.items.get(id)! - 1);
            if(this.items.get(id) === 0) this.items.delete(id);
        }
        this._changed();
    }

    protected _changed() {
        this.events.emit('backet:change', { items: Array.from(this.items.keys()) });
    }
    
}

class BasketItemView implements IView {
    protected title: HTMLSpanElement;
    protected addButton: HTMLButtonElement;
    protected removeButton: HTMLButtonElement;

    protected id: string | null = null;
    
    constructor(protected container: HTMLElement, protected events: EventEmitter) {
        this.title = container.querySelector('.basket-item__title') as HTMLSpanElement;
        this.addButton = container.querySelector('.basket-item__add') as HTMLButtonElement;
        this.removeButton = container.querySelector('.basket-item__remove') as HTMLButtonElement;

        this.addButton.addEventListener('click', () => {
            this.events.emit('ui:basket-add', { id: this.id });
        });

        this.removeButton.addEventListener('click', () => {
            this.events.emit('ui:basket-remove', { id: this.id });
        });
    }

    render(data?: { id: string, title: string }): HTMLElement {
        if(data) {
            this.id = data.id;
            this.title.textContent = data.title;
        }

        return this.container;
    }
}