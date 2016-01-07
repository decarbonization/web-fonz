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

suite("PieTests", () => {
    var bus: Bus;
    var pie: Pie;
    var listener: PieTestsListener;

    setup(() => {
        bus = new Bus();
        pie = new Pie(bus);
        listener = new PieTestsListener();
        bus.register(listener);
    });

    teardown(() => {
        bus.unregister(listener);
    });


    test("#constructor", () => {
        Slots.forEach((slot) => {
            assert.equal(pie.getPiece(slot), Piece.EMPTY);
        });
    });


    test("#canPlacePiece", () => {
        assert.isTrue(pie.canPlacePiece(Slot.TOP_LEFT, Piece.GREEN));
        assert.isTrue(pie.tryPlacePiece(Slot.TOP_LEFT, Piece.GREEN));
        assert.isFalse(pie.canPlacePiece(Slot.TOP_LEFT, Piece.PURPLE));

        assert.isTrue(pie.canPlacePiece(Slot.TOP_RIGHT, Piece.ORANGE));
        assert.isTrue(pie.tryPlacePiece(Slot.TOP_RIGHT, Piece.ORANGE));
        assert.isFalse(pie.canPlacePiece(Slot.TOP_RIGHT, Piece.GREEN));
    });


    test("#tryPlacePiece", () => {
        assert.isTrue(pie.tryPlacePiece(Slot.TOP_LEFT, Piece.ORANGE));
        assert.isFalse(pie.tryPlacePiece(Slot.TOP_LEFT, Piece.GREEN));

        assert.isTrue(pie.tryPlacePiece(Slot.TOP_CENTER, Piece.ORANGE));
        assert.isFalse(pie.tryPlacePiece(Slot.TOP_CENTER, Piece.ORANGE));

        assert.equal(listener.countEventsFrom(pie), 2);
    });


    test("#isFull", () => {
        assert.isFalse(pie.isFull());

        pie.tryPlacePiece(Slot.TOP_LEFT, Piece.ORANGE);
        assert.isFalse(pie.isFull());

        Slots.forEach((slot) => {
            pie.tryPlacePiece(slot, Piece.ORANGE);
        });

        assert.isTrue(pie.isFull());
    });


    test("#reset", () => {
        assert.isFalse(pie.isFull());

        Slots.forEach((slot) => {
            pie.tryPlacePiece(slot, Piece.ORANGE);
        });

        assert.isTrue(pie.isFull());

        pie.reset();

        assert.isFalse(pie.isFull());

        assert.equal(listener.countEventsFrom(pie), 7);
    });


    test("#isSingleColor", () => {
        assert.isFalse(pie.isSingleColor());

        pie.tryPlacePiece(Slot.TOP_LEFT, Piece.ORANGE);
        pie.tryPlacePiece(Slot.TOP_CENTER, Piece.PURPLE);
        pie.tryPlacePiece(Slot.TOP_RIGHT, Piece.PURPLE);
        pie.tryPlacePiece(Slot.BOTTOM_LEFT, Piece.GREEN);
        pie.tryPlacePiece(Slot.BOTTOM_CENTER, Piece.GREEN);
        pie.tryPlacePiece(Slot.BOTTOM_RIGHT, Piece.PURPLE);

        assert.isFalse(pie.isSingleColor());

        pie.reset();

        pie.tryPlacePiece(Slot.TOP_LEFT, Piece.ORANGE);
        pie.tryPlacePiece(Slot.TOP_CENTER, Piece.ORANGE);
        pie.tryPlacePiece(Slot.TOP_RIGHT, Piece.ORANGE);
        pie.tryPlacePiece(Slot.BOTTOM_LEFT, Piece.ORANGE);
        pie.tryPlacePiece(Slot.BOTTOM_CENTER, Piece.ORANGE);
        pie.tryPlacePiece(Slot.BOTTOM_RIGHT, Piece.ORANGE);

        assert.isTrue(pie.isSingleColor());
    });
});

class PieTestsListener {
    public events: Array<PieChangedEvent> = [];

    countEventsFrom(pie: Pie): number {
        var sum: number = 0;
        this.events.forEach((maybeMatch) => {
            if (maybeMatch.pie == pie) {
                sum++;
            }
        });
        return sum;
    }

    @subscribe(PieChangedEvent)
    onPieChanged(event: PieChangedEvent): void {
        this.events.push(event);
    }
}