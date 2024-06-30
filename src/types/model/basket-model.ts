import { EventEmitter } from "../../components/base/events";

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