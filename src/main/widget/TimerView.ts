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

///<reference path="CanvasView.ts"/>

class TimerView extends CanvasView {
    private static DEG_START = 0;
    private static DEG_END = 360 * CanvasView.DEG_TO_RAD;
    private static STROKE_WIDTH = 2;
    private static STROKE_COLOR = "#1E88E5";

    private _tickCount: number = 10;
    private _tick: number = 0;
    private _hidden: boolean = false;


    get tickCount(): number {
        return this._tickCount;
    }

    set tickCount(value: number) {
        this._tickCount = value;
        this.postInvalidate();
    }

    get tick(): number {
        return this._tick;
    }

    set tick(value: number) {
        this._tick = value;
        this.invalidate();
    }

    get hidden(): boolean {
        return this._hidden;
    }

    set hidden(value: boolean) {
        this._hidden = value;
        this.invalidate();
    }

    protected onDraw(context: CanvasRenderingContext2D,
                     width: number,
                     height: number): void {
        if (this._hidden) {
            return;
        }

        var midX = width / 2;
        var midY = height / 2;
        var radius = midX - TimerView.STROKE_WIDTH;
        var endFraction = this._tick / this._tickCount;

        context.strokeStyle = TimerView.STROKE_COLOR;
        context.lineWidth = TimerView.STROKE_WIDTH;

        context.rotate(-90 * CanvasView.DEG_TO_RAD);
        context.translate(-width, 0);

        context.beginPath();
        context.arc(midX, midY, radius,
                    TimerView.DEG_START,
                    TimerView.DEG_END * endFraction);
        context.stroke();
    }
}