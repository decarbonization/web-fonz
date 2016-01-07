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

suite("GameTests", () => {
    var clock: lolex.Clock;
    var listener: GameTestsEventListener;
    var bus: Bus;
    var game: Game;

    setup(() => {
        clock = lolex.install();
        listener = new GameTestsEventListener();
        bus = new Bus();
        game = new Game(bus);
        bus.register(listener);
    });

    teardown(() => {
        bus.unregister(listener);
        clock.uninstall();
    });


    test("#doNewCountUp", () => {
        assert.isFalse(game.inProgress);
        assert.isNull(game.upcomingPiece);

        game.doNewCountUp();

        assert.isTrue(game.inProgress);
        assert.isNotNull(game.upcomingPiece);

        assert.isTrue(listener.countUpStarted);
        assert.include(listener.events, new UpcomingPieceAvailableEvent());
    });

    
    test("#newGame", () => {
        assert.isFalse(game.inProgress);
        assert.isNull(game.upcomingPiece);

        game.newGame();

        assert.isTrue(game.inProgress);
        assert.isNotNull(game.upcomingPiece);

        assert.isTrue(listener.countUpStarted);
        assert.include(listener.events, new NewGameEvent());
        assert.include(listener.events, new UpcomingPieceAvailableEvent());
    });

    
    test("#tryPlacePieceOneColor", () => {
        game.newGame();

        assert.isTrue(game.inProgress);
        assert.isNotNull(game.upcomingPiece);

        assert.isTrue(listener.countUpStarted);
        assert.include(listener.events, new NewGameEvent());
        assert.include(listener.events, new UpcomingPieceAvailableEvent());

        var pie: Pie = game.board.getPie(0);
        Slots.forEach(slot => pie.tryPlacePiece(slot, Piece.PURPLE), Slot.TOP_CENTER);

        game.testSetUpcomingPiece(new UpcomingPiece(Piece.PURPLE, Slot.TOP_LEFT));
        assert.equal(game.tryPlaceCurrentPiece(pie), PlacementResult.PIE_COMPLETED_SINGLE_COLOR);

        assert.equal(pie.getOccupiedSlotCount(), 0);
        assert.include(listener.events, new ScoreChangedEvent(120));
        assert.include(listener.events, new LifeChangedEvent(Life.INITIAL_VALUE + 1));
        assert.equal(game.countUp.tickDuration, 900);
        assert.isTrue(game.board.hasPowerUp(PowerUp.MULTIPLY_SCORE));

        assert.equal(listener.occurrencesOf(UpcomingPieceAvailableEvent), 2);
    });

    
    test("#tryPlacePieceMultipleColors", () => {
        game.newGame();

        assert.isTrue(game.inProgress);
        assert.isNotNull(game.upcomingPiece);

        assert.isTrue(listener.countUpStarted);
        assert.include(listener.events, new NewGameEvent());
        assert.include(listener.events, new UpcomingPieceAvailableEvent());

        var pie: Pie = game.board.getPie(0);
        Slots.forEach(slot => pie.tryPlacePiece(slot, Piece.PURPLE), Slot.TOP_CENTER);

        game.testSetUpcomingPiece(new UpcomingPiece(Piece.GREEN, Slot.TOP_LEFT));
        assert.equal(game.tryPlaceCurrentPiece(pie), PlacementResult.PIE_COMPLETED_MULTI_COLOR);

        assert.equal(pie.getOccupiedSlotCount(), 0);
        assert.include(listener.events, new ScoreChangedEvent(60));
        assert.notInclude(listener.events, new LifeChangedEvent(Life.INITIAL_VALUE + 1));
        assert.equal(game.countUp.tickDuration, 900);
        assert.isFalse(game.board.hasPowerUp(PowerUp.MULTIPLY_SCORE));

        assert.equal(listener.occurrencesOf(UpcomingPieceAvailableEvent), 2);
    });

    
    test("#skipPiece", () => {
        game.newGame();

        assert.isTrue(game.inProgress);
        assert.isNotNull(game.upcomingPiece);

        assert.isTrue(listener.countUpStarted);
        assert.include(listener.events, new NewGameEvent());
        assert.include(listener.events, new UpcomingPieceAvailableEvent());

        game.skipPiece();

        assert.include(listener.events, new LifeChangedEvent(Life.INITIAL_VALUE - 1));
        assert.equal(listener.occurrencesOf(UpcomingPieceAvailableEvent), 2);
        assert.isTrue(game.inProgress);
        assert.isNotNull(game.upcomingPiece);
        assert.equal(game.countUp.tickDuration, 900);
    });

    
    test("#pause", () => {
        game.newGame();
        game.powerUpTimer.schedulePowerUp(PowerUp.MULTIPLY_SCORE,
                                          CountUp.NUMBER_TICKS);
        clock.tick(2000);

        game.pause();
        assert.isTrue(game.paused);

        clock.tick(1000 + 10);
        assert.isTrue(game.powerUpTimer.isPending(PowerUp.MULTIPLY_SCORE));

        game.resume();
        assert.isFalse(game.paused);

        clock.tick(1000 * CountUp.NUMBER_TICKS * 3);
        assert.isFalse(game.powerUpTimer.isPending(PowerUp.MULTIPLY_SCORE));

        game.pause();
        assert.isTrue(game.paused);

        game.gameOver(GameOverCause.GAME_LOGIC);
        assert.isFalse(game.paused);
    });

    
    test("#gameOver", () => {
        game.newGame();

        assert.isTrue(game.inProgress);
        assert.isNotNull(game.upcomingPiece);

        assert.isTrue(listener.countUpStarted);
        assert.include(listener.events, new NewGameEvent());
        assert.include(listener.events, new UpcomingPieceAvailableEvent());

        game.gameOver(GameOverCause.GAME_LOGIC);

        assert.isFalse(game.inProgress);
        assert.isNull(game.upcomingPiece);

        assert.include(listener.events, new GameOverEvent(GameOverCause.GAME_LOGIC, 0));
    });


    
    test("#clearAll", () => {
        game.newGame();

        for (var i = 0; i < Board.NUMBER_PIES; i++) {
            game.board.getPie(i).tryPlacePiece(Slot.TOP_LEFT, Piece.PURPLE);
        }

        assert.isFalse(game.clearAll());

        game.board.addPowerUp(PowerUp.CLEAR_ALL);

        assert.isTrue(game.clearAll());
        assert.isFalse(game.board.hasPowerUp(PowerUp.CLEAR_ALL));
        for (var i = 0; i < Board.NUMBER_PIES; i++) {
            assert.equal(game.board.getPie(i).getOccupiedSlotCount(), 0);
        }
    });

    
    test("#multiplyScore", () => {
        game.newGame();

        assert.isFalse(game.multiplyScore());
        game.board.addPowerUp(PowerUp.MULTIPLY_SCORE);

        assert.isTrue(game.multiplyScore());
        assert.isFalse(game.multiplyScore());
        assert.isTrue(game.powerUpTimer.isPending(PowerUp.MULTIPLY_SCORE));
        assert.equal(game.score.multiplier, 2);

        clock.tick(PowerUpTimer.TICK_DURATION * PowerUpTimer.STANDARD_NUMBER_TICKS);

        assert.isFalse(game.powerUpTimer.isPending(PowerUp.MULTIPLY_SCORE));
        assert.equal(game.score.multiplier, 1);
    });

    
    test("#slowDownTime", () => {
        game.newGame();

        assert.isFalse(game.slowDownTime());
        game.board.addPowerUp(PowerUp.SLOW_DOWN_TIME);

        assert.isTrue(game.slowDownTime());
        assert.isFalse(game.slowDownTime());
        assert.isTrue(game.powerUpTimer.isPending(PowerUp.SLOW_DOWN_TIME));
        assert.equal(game.countUp.tickDuration, 2000);

        clock.tick(PowerUpTimer.TICK_DURATION * PowerUpTimer.STANDARD_NUMBER_TICKS);

        assert.isFalse(game.powerUpTimer.isPending(PowerUp.SLOW_DOWN_TIME));
        assert.notEqual(game.countUp.tickDuration, 2000);
    });
    

    class GameTestsEventListener {
        public events: Array<BusEvent> = [];
        public countUpStarted: boolean = false;

        occurrencesOf(c: Function): number {
            return this.events.filter(e => e instanceof c).length;
        }

        @subscribe(LifeChangedEvent)
        onLifeChanged(change: LifeChangedEvent) {
            this.events.push(change);
        }

        @subscribe(ScoreChangedEvent)
        onScoreChanged(change: ScoreChangedEvent) {
            this.events.push(change);
        }

        @subscribe(UpcomingPieceAvailableEvent)
        onUpcomingPieceAvailable(event: UpcomingPieceAvailableEvent) {
            this.events.push(event);
        }

        @subscribe(CountUpTickedEvent)
        onCountUpTick(tick: CountUpTickedEvent) {
            if (tick.getValue() == 1) {
                this.countUpStarted = true;
            }
        }

        @subscribe(NewGameEvent)
        onNewGame(event: NewGameEvent) {
            this.events.push(event);
        }

        @subscribe(GameOverEvent)
        onGameOver(event: GameOverEvent) {
            this.events.push(event);
        }
    }
});