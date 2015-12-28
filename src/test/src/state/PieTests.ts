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