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

///<reference path="../events/BusEvent.ts"/>

class Pie {
    private slots: Array<Piece> = [];
    private occupiedSlots: number = 0;

    constructor(public bus: Bus) {
        Slots.forEach((slot) => {
            this.slots[slot] = Piece.EMPTY;
        });
    }

    canPlacePiece(slot: Slot, piece: Piece): boolean {
        return (this.occupiedSlots < Slots.COUNT &&
                this.slots[slot] == Piece.EMPTY);
    }

    tryPlacePiece(slot: Slot, piece: Piece): boolean {
        if (this.occupiedSlots == Slots.COUNT) {
            return false;
        }

        if (this.slots[slot] == Piece.EMPTY) {
            this.slots[slot] = piece;
            this.occupiedSlots++;

            this.bus.post(new PieChangedEvent(this));
            return true;
        } else {
            return false;
        }
    }

    getPiece(offset: Slot): Piece {
        return this.slots[offset];
    }

    getOccupiedSlotCount(): number {
        return this.occupiedSlots;
    }

    isFull(): boolean {
        return (this.occupiedSlots == Slots.COUNT);
    }

    isSingleColor(): boolean {
        if (this.isFull()) {
            var first = this.slots[Slot.TOP_LEFT];
            for (var slot = Slots.FIRST; slot < Slots.COUNT; slot++) {
                if (this.slots[slot] != first) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    reset(): void {
        Slots.forEach((slot) => {
            this.slots[slot] = Piece.EMPTY;
        });
        this.occupiedSlots = 0;

        this.bus.post(new PieChangedEvent(this));
    }
}

class PieChangedEvent extends BusEvent {
    constructor(public pie: Pie) {
        super();
    }
}