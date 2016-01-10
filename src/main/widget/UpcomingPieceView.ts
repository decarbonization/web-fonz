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
///<reference path="TimerView.ts"/>

class UpcomingPieceView extends ClickableView<HTMLDivElement> {
    private _upcomingPiece: UpcomingPiece = null;
    private _paused: boolean = false;
    private _pieceNode: HTMLDivElement;
    private _timerView: TimerView;

    constructor(node: HTMLDivElement) {
        super(node);

        this._pieceNode = node.querySelector('#upcoming-piece') as HTMLDivElement;
        this._timerView = new TimerView(node.querySelector('#upcoming-timer') as HTMLCanvasElement);
        this._timerView.tickCount = CountUp.NUMBER_TICKS;
    }


    get upcomingPiece(): UpcomingPiece {
        return this._upcomingPiece;
    }

    set upcomingPiece(value: UpcomingPiece) {
        this._upcomingPiece = value;
        if (value != null) {
            this._pieceNode.className = Pieces.getClass(value.slot, value.piece);
        } else {
            this._pieceNode.className = '';
        }
    }

    get paused(): boolean {
        return this._paused;
    }

    set paused(paused: boolean) {
        this._paused = paused;
        this._timerView.hidden = paused;

        if (paused) {
            this.node.style.opacity = '0.4';
            this._pieceNode.style.display = 'none';
        } else {
            this.node.style.opacity = '1.0';
            this._pieceNode.style.display = 'block';
        }
    }

    set tick(tick: number) {
        this._timerView.tick = tick;
    }
}