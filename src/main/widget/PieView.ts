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
///<reference path="../state/Pie.ts"/>
///<reference path="../util/Bus.ts"/>

class PieView extends ClickableView<HTMLDivElement> {
    private slots: Array<HTMLDivElement> = [];
    private _pie: Pie;

    constructor(node: HTMLDivElement) {
        super(node);

        Slots.forEach(slot => {
            var child = document.createElement('div');
            node.appendChild(child);
            this.slots[slot] = child;
        });
    }

    set pie(pie) {
        if (this._pie != null) {
            var bus = this._pie.bus;
            if (bus != null) {
                bus.unregister(this);
            }
        }

        this._pie = pie;

        if (pie != null) {
            var bus: Bus = pie.bus;
            if (bus != null) {
                bus.register(this);
            }
        }

        this.update();
    }


    get pie(): Pie {
        return this._pie;
    }

    private update(): void {
        if (this._pie != null) {
            Slots.forEach(slot => {
                var node = this.slots[slot];
                var piece = this.pie.getPiece(slot);
                node.className = Pieces.getClass(slot, piece);
            });
        } else {
            this.slots.forEach(node => {
                node.className = '';
            });
        }
    }

    @subscribe(PieChangedEvent)
    onPieChanged(event: PieChangedEvent): void {
        if (event.pie == this._pie) {
            this.update();
        }
    }
}
