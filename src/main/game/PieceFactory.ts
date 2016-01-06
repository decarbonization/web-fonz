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

class PieceFactory {
    static COUNT_PER_COLOR = 30;
    static COUNT_PER_SLOT = 20;

    private pieces: Array<Piece> = [];
    private slots: Array<number> = [];

    private lastSlot: number = Slots.COUNT;

    public preventDuplicatePieces: boolean = true;

    constructor() {
        this.populateSlots();
        this.populateSlots();
    }

    private static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    generatePiece(): Piece {
        if (this.pieces.length == 0) {
            this.populatePieces();
        }

        var position = PieceFactory.randomInt(0, this.pieces.length);
        var piece = this.pieces[position];
        this.pieces.splice(position, 1);
        return piece;
    }

    generateSlot(): Slot {
        if (this.slots.length == 0) {
            this.populateSlots();
        }

        var position = PieceFactory.randomInt(0, this.slots.length);
        var slot = this.slots[position];
        this.slots.splice(position, 1);
        return slot;
    }

    generateUniqueSlot(): Slot {
        var slot: Slot;
        //noinspection StatementWithEmptyBodyJS
        while ((slot = this.generateSlot()) == this.lastSlot);
        this.lastSlot = slot;
        return slot;
    }

    generateUpcomingPiece(): UpcomingPiece {
        if (this.preventDuplicatePieces) {
            return new UpcomingPiece(this.generatePiece(), this.generateUniqueSlot());
        } else {
            return new UpcomingPiece(this.generatePiece(), this.generateSlot());
        }
    }


    reset() {
        this.pieces.splice(0, this.slots.length);
        this.populatePieces();

        this.slots.splice(0, this.slots.length);
        this.populateSlots();

        this.lastSlot = Slots.COUNT;
    }

    private populatePieces(): void {
        Pieces.forEach(color => {
            for (var i = 0; i < PieceFactory.COUNT_PER_COLOR; i++) {
                this.pieces.push(color);
            }
        }, Piece.ORANGE);
    }

    private populateSlots(): void {
        Slots.forEach(slot => {
            for (var i = 0; i < PieceFactory.COUNT_PER_SLOT; i++) {
                this.slots.push(slot);
            }
        });
    }
}