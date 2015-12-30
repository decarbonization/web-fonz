class View<N extends HTMLElement> {
    constructor(private _node: N) {
    }

    //region Properties

    get node(): N {
        return this._node;
    }

    get style(): CSSStyleDeclaration {
        return this.node.style;
    }

    set html(html: string) {
        this.node.innerHTML = html;
    }

    get html(): string {
        return this.node.innerHTML;
    }

    set text(html: string) {
        this.node.innerText = html;
    }

    get text(): string {
        return this.node.innerText;
    }

    addClass(...ns: string[]): void {
        this.node.classList.add(...ns);
    }

    removeClass(...ns: string[]): void {
        this.node.classList.remove(...ns);
    }

    toggleClass(name: string): void {
        this.node.classList.toggle(name);
    }

    hasClass(name: string): boolean {
        return this.node.classList.contains(name);
    }

    //endregion


    //region Events

    attach(eventName: string, listener: (Event) => any, useCapture: boolean = false): void {
        this.node.addEventListener(eventName, listener, useCapture);
    }

    detach(eventName: string, listener: (Event) => any, useCapture: boolean = false): void {
        this.node.removeEventListener(eventName, listener, useCapture);
    }

    dispatch(event: Event): boolean {
        return this.node.dispatchEvent(event);
    }

    //endregion
}

function $e(selector: string): any {
    return document.querySelector(selector);
}
