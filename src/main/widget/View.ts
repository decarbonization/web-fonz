class View<N extends HTMLElement> {
    static EVENT_MOUSE_DOWN: string = 'mousedown';
    static EVENT_MOUSE_UP: string = 'mouseup';
    static EVENT_CLICK: string = 'click';

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

    get className(): string {
        return this.node.className;
    }

    set className(cls: string) {
        this.node.className = cls;
    }

    //endregion


    //region Events

    addEventListener(eventName: string,
                     listener: (Event) => any,
                     useCapture: boolean = false): void {
        this.node.addEventListener(eventName, listener, useCapture);
    }

    removeEventListener(eventName: string,
                        listener: (Event) => any,
                        useCapture: boolean = false): void {
        this.node.removeEventListener(eventName, listener, useCapture);
    }

    dispatchEvent(event: Event): boolean {
        return this.node.dispatchEvent(event);
    }

    //endregion


    //region Tags

    public tag: any = null;

    setData(key: string, value: string): void {
        this.node.dataset[key] = value;
    }

    getData(key: string): string {
        return this.node.dataset[key];
    }

    //endregion


    //region Child Nodes

    $e(selector: string): any {
        return this.node.querySelector(selector);
    }

    $es(selector: string): NodeListOf<any> {
        return this.node.querySelectorAll(selector);
    }

    //endregion
}

function $e(selector: string): any {
    return document.querySelector(selector);
}

function $es(selector: string): any {
    return document.querySelectorAll(selector);
}
