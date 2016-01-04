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

    constructor(public bus: Bus) {
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
        console.log("Game#doNewCountUp()");

        this._inProgress = true;
        this._upcomingPiece = this.pieceFactory.generateUpcomingPiece();
        console.log("Game: Upcoming piece " + this.upcomingPiece);

        this.countUp.start();

        this.bus.post(new UpcomingPieceAvailableEvent());
    }

    reset(): void {
        console.log("Game#reset()");

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
        console.log("Game#newGame()");

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
        console.log("Game#skipPiece()");

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
        console.log("Game#pause()");

        if (!this.paused && this.inProgress) {
            this.countUp.pause();
            this.powerUpTimer.pause();
            this._paused = true;

            this.bus.post(new PauseStateChangedEvent(true));
        }
    }

    resume(): void {
        console.log("Game#resume()");

        if (this.paused && this.inProgress) {
            this.countUp.resume();
            this.powerUpTimer.resume();
            this._paused = false;

            this.bus.post(new PauseStateChangedEvent(false));
        }
    }

    gameOver(how: GameOverCause): void {
        console.log("Game#gameOver()");

        if (this.inProgress) {
            var finalScore = this.score.value;
            this.reset();
            this.bus.post(new GameOverEvent(how, finalScore));
        }
    }

    //endregion

    //region Power Ups

    clearAll(): boolean {
        console.log("Game#clearAll()");

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
        console.log("Game#useScoreMultiplier()");

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
        console.log("Game#slowDownTime()");

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
        console.log("Game#onPowerUpExpired(" + powerUp + ")");

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
