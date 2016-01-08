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

///<reference path="../data/Piece.ts"/>
///<reference path="../data/PowerUp.ts"/>
///<reference path="../data/Slot.ts"/>
///<reference path="../data/UpcomingPiece.ts"/>
///<reference path="../events/BusEvent.ts"/>
///<reference path="../events/BusValueEvent.ts"/>
///<reference path="PieceFactory.ts"/>
///<reference path="../state/Board.ts"/>
///<reference path="../state/Life.ts"/>
///<reference path="../state/Pie.ts"/>
///<reference path="../state/Score.ts"/>
///<reference path="CountUp.ts"/>
///<reference path="PowerUpTimer.ts"/>

class Game {
    public life: Life;
    public score: Score;
    public board: Board;

    public countUp: CountUp;
    public powerUpTimer: PowerUpTimer;

    private pieceFactory: PieceFactory = new PieceFactory();
    private _inProgress: boolean = false;
    private _paused: boolean = false;
    private _upcomingPiece: UpcomingPiece = null;

    constructor(public bus: Bus, private logger: Logger) {
        this.life = new Life(bus);
        this.score = new Score(bus);
        this.board = new Board(bus);

        this.countUp = new CountUp(bus);
        this.powerUpTimer = new PowerUpTimer(bus);

        bus.register(this);
    }


    get inProgress(): boolean {
        return this._inProgress;
    }

    get paused(): boolean {
        return this._paused;
    }

    testSetUpcomingPiece(piece: UpcomingPiece): void {
        this._upcomingPiece = piece;
    }

    get upcomingPiece(): UpcomingPiece {
        return this._upcomingPiece;
    }


    //region Internal

    doNewCountUp(): void {
        this.logger.info("Game", "doNewCountUp()");

        this._inProgress = true;
        this._upcomingPiece = this.pieceFactory.generateUpcomingPiece();
        this.logger.info("Game", "Game: Upcoming piece " + this.upcomingPiece);

        this.countUp.start();

        this.bus.post(new UpcomingPieceAvailableEvent());
    }

    reset(): void {
        this.logger.info("Game", "reset()");

        this.pieceFactory.reset();

        this.countUp.stop();
        this.powerUpTimer.stop();

        this.life.reset();
        this.score.reset();
        this.board.reset();

        this._inProgress = false;
        this._paused = false;
        this._upcomingPiece = null;
    }

    //endregion


    //region Controls

    newGame(): void {
        this.logger.info("Game", "newGame()");

        if (!this.inProgress) {
            this.reset();
            this.doNewCountUp();

            this.bus.post(new NewGameEvent());
        }
    }

    canPlaceCurrentPiece(pie: Pie): boolean {
        return (this.inProgress && pie.canPlacePiece(this.upcomingPiece.slot, this.upcomingPiece.piece));
    }

    tryPlaceCurrentPiece(pie: Pie): PlacementResult {
        if (this.inProgress && pie.tryPlacePiece(this.upcomingPiece.slot, this.upcomingPiece.piece)) {
            var result = PlacementResult.PIECE_ACCEPTED;
            if (pie.isFull()) {
                var isSingleColor = pie.isSingleColor();
                this.score.addPie(isSingleColor);
                pie.reset();

                if (isSingleColor) {
                    this.life.increment();

                    var slot = this.board.getSlot(pie);
                    if (this.board.pieHasPowerUp(slot)) {
                        this.board.addPowerUp(PowerUps.forSlot(slot));
                    }

                    result = PlacementResult.PIE_COMPLETED_SINGLE_COLOR;
                } else {
                    result = PlacementResult.PIE_COMPLETED_MULTI_COLOR;
                }

                this.countUp.scaleTickDuration(CountUp.DEFAULT_SCALE_FACTOR);
            }

            this.doNewCountUp();
            return result;
        } else {
            return PlacementResult.PIECE_REJECTED;
        }
    }

    skipPiece(): void {
        this.logger.info("Game", "skipPiece()");

        if (this.inProgress) {
            this.life.decrement();
            if (this.life.isAlive()) {
                this.countUp.scaleTickDuration(CountUp.DEFAULT_SCALE_FACTOR);
                this.doNewCountUp();
            } else {
                this.gameOver(GameOverCause.GAME_LOGIC);
            }
        }
    }

    pause(): void {
        this.logger.info("Game", "pause()");

        if (!this.paused && this.inProgress) {
            this.countUp.pause();
            this.powerUpTimer.pause();
            this._paused = true;

            this.bus.post(new PauseStateChangedEvent(true));
        }
    }

    resume(): void {
        this.logger.info("Game", "resume()");

        if (this.paused && this.inProgress) {
            this.countUp.resume();
            this.powerUpTimer.resume();
            this._paused = false;

            this.bus.post(new PauseStateChangedEvent(false));
        }
    }

    gameOver(how: GameOverCause): void {
        this.logger.info("Game", "gameOver()");

        if (this.inProgress) {
            var finalScore = this.score.value;
            this.reset();
            this.bus.post(new GameOverEvent(how, finalScore));
        }
    }

    //endregion

    //region Power Ups

    clearAll(): boolean {
        this.logger.info("Game", "clearAll()");

        if (this.inProgress && this.board.usePowerUp(PowerUp.CLEAR_ALL)) {
            for (var i = 0; i < Board.NUMBER_PIES; i++) {
                this.board.getPie(i).reset();
            }
            this.doNewCountUp();

            return true;
        } else {
            return false;
        }
    }

    multiplyScore(): boolean {
        this.logger.info("Game", "useScoreMultiplier()");

        if (this.inProgress && this.board.hasPowerUp(PowerUp.MULTIPLY_SCORE) &&
            !this.powerUpTimer.isPending(PowerUp.MULTIPLY_SCORE)) {
            this.score.multiplier = 2.0;
            this.powerUpTimer.schedulePowerUp(PowerUp.MULTIPLY_SCORE,
                                              PowerUpTimer.STANDARD_NUMBER_TICKS);
            return true;
        } else {
            return false;
        }
    }

    slowDownTime(): boolean {
        this.logger.info("Game", "slowDownTime()");

        if (this.inProgress && this.board.hasPowerUp(PowerUp.SLOW_DOWN_TIME) &&
            !this.powerUpTimer.isPending(PowerUp.SLOW_DOWN_TIME)) {
            this.countUp.scaleTickDuration(2.0);
            this.powerUpTimer.schedulePowerUp(PowerUp.SLOW_DOWN_TIME,
                                              PowerUpTimer.STANDARD_NUMBER_TICKS);
            return true;
        } else {
            return false;
        }
    }

    @subscribe(PowerUpExpiredEvent)
    onPowerUpExpired(expiration: PowerUpExpiredEvent): void {
        var powerUp = expiration.getValue();
        this.logger.info("Game", "onPowerUpExpired(" + powerUp + ")");

        this.board.usePowerUp(powerUp);
        switch (powerUp) {
            case PowerUp.MULTIPLY_SCORE:
                this.score.multiplier = 1.0;
                break;

            case PowerUp.CLEAR_ALL:
                // Do nothing.
                break;

            case PowerUp.SLOW_DOWN_TIME:
                this.countUp.scaleTickDuration(0.5);
                break;
        }
    }

    //endregion

    @subscribe(CountUpCompletedEvent)
    onCountUpCompleted(ignored: CountUpCompletedEvent): void {
        this.skipPiece();
    }
}

class NewGameEvent extends BusEvent {
}

enum GameOverCause {
    USER_INTERVENTION,
    GAME_LOGIC,
}

class GameOverEvent extends BusEvent {
    constructor(public cause: GameOverCause, public score: number) {
        super();
    }
}

class UpcomingPieceAvailableEvent extends BusEvent {
}

class PauseStateChangedEvent extends BusValueEvent<boolean> {
    constructor(value: boolean) {
        super(value);
    }
}

enum PlacementResult {
    PIE_COMPLETED_MULTI_COLOR,
    PIE_COMPLETED_SINGLE_COLOR,
    PIECE_ACCEPTED,
    PIECE_REJECTED,
}
