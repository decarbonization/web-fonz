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

///<reference path="View.ts"/>

class ClickableView<N extends HTMLElement> extends View<N> {
    private _onClick: (This?, Event?) => void;
    private _clickable: boolean = true;

    constructor(node: N) {
        super(node);

        this.addEventListener(View.EVENT_CLICK, this.dispatchClick.bind(this));
    }


    get onClick(): (This?, Event?) => void {
        return this._onClick;
    }

    set onClick(value: (This?, Event?) => void) {
        this._onClick = value;
        this.clickable = (!!value);
    }

    get clickable(): boolean {
        return this._clickable;
    }

    set clickable(value: boolean) {
        this._clickable = value;

        if (value) {
            this.addClass("clickable");
        } else {
            this.removeClass("clickable");
        }
    }

    dispatchClick(e: Event): boolean {
        if (this.clickable) {
            if (this.onClick) {
                this.onClick(this, e);
            }
            return true;
        } else {
            return false;
        }
    }
}