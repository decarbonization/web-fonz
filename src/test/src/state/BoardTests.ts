var assert = chai.assert;

suite("BoardTests", () => {
    var bus: Bus;
    var board: Board;
    var listener: BoardTestsListener;

    setup(() => {
        bus = new Bus();
        board = new Board(bus);
        listener = new BoardTestsListener();
        bus.register(listener);
    });

    teardown(() => {
        bus.unregister(listener);
    });

    test("#reset", () => {
        for (var i = 0; i < Board.NUMBER_PIES; i++) {
            board.getPie(i).tryPlacePiece(0, Piece.GREEN);
        }
        board.addPowerUp(PowerUp.CLEAR_ALL);

        board.reset();
        assert.equal(listener.events.length, 2);

        for (var i = 0; i < Board.NUMBER_PIES; i++) {
            assert.equal(board.getPie(i).getPiece(0), Piece.EMPTY);
        }
        assert.isFalse(board.hasPowerUp(PowerUp.CLEAR_ALL));
    });

    test("#pieHasPowerUp", () => {
        assert.isTrue(board.pieHasPowerUp(0));
        assert.isTrue(board.pieHasPowerUp(1));
        assert.isTrue(board.pieHasPowerUp(2));
        assert.isFalse(board.pieHasPowerUp(3));
        assert.isFalse(board.pieHasPowerUp(4));
        assert.isFalse(board.pieHasPowerUp(5));
    });

    test("#addAvailablePowerUp", () => {
        assert.isTrue(board.addPowerUp(PowerUp.CLEAR_ALL));
        assert.equal(listener.events.length, 1);
        assert.isTrue(board.hasPowerUp(PowerUp.CLEAR_ALL));

        assert.isFalse(board.addPowerUp(PowerUp.CLEAR_ALL));
        assert.equal(listener.events.length, 1);
    });

    test("#usePowerUp", () => {
        assert.isTrue(board.addPowerUp(PowerUp.CLEAR_ALL));
        assert.isTrue(board.hasPowerUp(PowerUp.CLEAR_ALL));
        assert.equal(listener.events.length, 1);

        assert.isTrue(board.usePowerUp(PowerUp.CLEAR_ALL));
        assert.isFalse(board.hasPowerUp(PowerUp.CLEAR_ALL));
        assert.equal(listener.events.length, 2);

        assert.isFalse(board.usePowerUp(PowerUp.CLEAR_ALL));
        assert.equal(listener.events.length, 2);
    });
});

class BoardTestsListener {
    public events: Array<PowerUpChangedEvent> = [];

    @subscribe(PowerUpChangedEvent)
    onPowerUpChanged(event: PowerUpChangedEvent): void {
        this.events.push(event);
    }
}
