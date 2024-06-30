import { container } from "webpack";
import { IView } from "../model/view-model";
import { EventEmitter } from "../../components/base/events";

class ProductView implements IView {
    protected title: HTMLHeadingElement;
    protected category: HTMLSpanElement;
    protected image: HTMLImageElement;
    protected price: HTMLSpanElement;
    protected cardButton: HTMLButtonElement;

    protected id: string | null = null;

    constructor(protected container: HTMLElement, protected events: EventEmitter) {
        const cardTemplate = document.querySelector('.card-catalog');
        this.title = cardTemplate.querySelector('.card__title');
        this.category = cardTemplate.querySelector('.card__category');
        this.image = cardTemplate.querySelector('.card__image');
        this.price = cardTemplate.querySelector('.card__price');
        this.cardButton = cardTemplate.querySelector('.card');

        this.cardButton.addEventListener('click', () => {
            this.events.emit("ui:product-click", { id: this.id })
        })
    }

    render(data?: { title: string, category: string, image: string, price: string }): HTMLElement {
        if(data) {
            this.title.textContent = data.title;
            this.category.textContent = data.category;
            this.image.src = data.image;
            this.price.textContent = data.price;
        }

        return this.container;
    }

}