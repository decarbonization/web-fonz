/*
 * Copyright (c) 2015, Peter 'Kevin' MacWhinnie
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions may not be sold, nor may they be used in a commercial
 *    product or activity.
 * 2. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 3. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

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
