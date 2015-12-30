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