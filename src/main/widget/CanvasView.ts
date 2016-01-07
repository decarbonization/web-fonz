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

///<reference path="ClickableView.ts"/>
///<reference path="../util/Scheduler.ts"/>

class CanvasView extends ClickableView<HTMLCanvasElement> {
    static DEG_TO_RAD = 0.0174533;

    private _scaleFactor: number;
    private _context: CanvasRenderingContext2D;
    private _pendingInvalidation: ScheduledTask = null;

    constructor(node: HTMLCanvasElement) {
        super(node);

        // By default, <canvas> renders at 1x. This fixes
        // up the metrics and backing canvas to render at
        // the correct scaled value.
        var width = this.node.width,
            height = this.node.height;
        this._scaleFactor = window.devicePixelRatio || 1;
        this.node.width = width * this._scaleFactor;
        this.node.style.width = width + "px";
        this.node.height = height * this._scaleFactor;
        this.node.style.height = height + "px";

        this._context = node.getContext("2d");
        this._context.scale(this._scaleFactor, this._scaleFactor);
        this.postInvalidate();
    }


    //region Properties

    get width(): number {
        return this.node.width / this._scaleFactor;
    }

    get height(): number {
        return this.node.height / this._scaleFactor;
    }

    set width(width: number) {
        this.node.width = width * this._scaleFactor;
        this.node.style.width = width + "px";
        this.postInvalidate();
    }

    set height(height: number) {
        this.node.height = height * this._scaleFactor;
        this.node.style.height = height + "px";
        this.postInvalidate();
    }

    //endregion


    //region Drawing

    protected onDraw(context: CanvasRenderingContext2D,
                     width: number,
                     height: number): void {
        // Do nothing.
    }

    invalidate(): void {
        if (!this._pendingInvalidation) {
            Scheduler.cancel(this._pendingInvalidation);
            this._pendingInvalidation = null;
        }

        var width = this.width,
            height = this.height;
        this._context.save();
        this._context.clearRect(0, 0, width, height);
        this.onDraw(this._context, width, height);
        this._context.restore();
    }

    postInvalidate(): void {
        if (!this._pendingInvalidation) {
            this._pendingInvalidation = Scheduler.schedule(this.invalidate.bind(this), 0);
        }
    }

    //endregion
}