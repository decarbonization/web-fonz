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
