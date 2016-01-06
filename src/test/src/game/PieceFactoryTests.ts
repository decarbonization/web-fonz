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

var assert = chai.assert;

suite("PieceFactoryTests", () => {
    var factory: PieceFactory;

    setup(() => {
        factory = new PieceFactory();
    });


    test("#generatePiece", () => {
        var pieces: Piece[] = [];
        for (var i = 0; i < (PieceFactory.COUNT_PER_COLOR * Pieces.COUNT + 1); i++) {
            pieces.push(factory.generatePiece());
        }

        assert.include(pieces, Piece.GREEN);
        assert.include(pieces, Piece.ORANGE);
        assert.include(pieces, Piece.PURPLE);
    });


    test("#generateSlot", () => {
        var slots: Array<number> = [];
        for (var i = 0; i < (PieceFactory.COUNT_PER_SLOT * Slots.COUNT + 1); i++) {
            slots.push(factory.generateSlot());
        }

        assert.include(slots, Slot.TOP_LEFT);
        assert.include(slots, Slot.TOP_CENTER);
        assert.include(slots, Slot.TOP_RIGHT);
        assert.include(slots, Slot.BOTTOM_LEFT);
        assert.include(slots, Slot.BOTTOM_CENTER);
        assert.include(slots, Slot.BOTTOM_RIGHT);
    });


    test("#generateUniqueSlot", () => {
        var lastSlot: Slot = Slots.COUNT;
        for (var i = 0; i < (PieceFactory.COUNT_PER_SLOT * Slots.COUNT + 1); i++) {
            var slot = factory.generateUniqueSlot();
            assert.notEqual(slot, lastSlot);
            lastSlot = slot;
        }
    });


    test("#preventDuplicates", () => {
        factory.preventDuplicatePieces = true;

        var lastPiece: Piece = Piece.EMPTY;
        var lastSlot: Slot = Slots.COUNT;
        for (var i = 0; i < (PieceFactory.COUNT_PER_SLOT * Slots.COUNT + 1); i++) {
            var upcomingPiece = factory.generateUpcomingPiece();
            assert.isTrue(upcomingPiece.slot != lastSlot || upcomingPiece.piece != lastPiece);
            lastPiece = upcomingPiece.piece;
            lastSlot = upcomingPiece.slot;
        }
    });
});