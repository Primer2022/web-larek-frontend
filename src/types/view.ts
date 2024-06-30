import { EventEmitter } from "../components/base/events";

interface IViewConstructor {
    new (container: HTMLElement, events?: EventEmitter): IView; 
}

export interface IView {
    render(data?: object) : HTMLElement;
}