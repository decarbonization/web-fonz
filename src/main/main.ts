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

///<reference path="widget/Button.ts"/>
///<reference path="widget/StatsView.ts"/>
///<reference path="widget/BoardView.ts"/>

///<reference path="game/Game.ts"/>
///<reference path="util/Bus.ts"/>

class Fonz implements BoardViewListener {
    bus: Bus = new Bus();
    game: Game;

    statsView: StatsView;
    boardView: BoardView;
    gameButton: Button;

    run(): void {
        console.log("Fonz#run");

        this.game = new Game(this.bus);
        this.bus.register(this);

        var settingsButton = Button.$('#game-control-settings');
        settingsButton.onClick = this.onSettingsClicked.bind(this);

        var helpButton = Button.$('#game-control-help');
        helpButton.onClick = this.onHelpClicked.bind(this);

        this.statsView = new StatsView($e('.game-stats'));
        this.statsView.life = this.game.life.value;
        this.statsView.score = this.game.score.value;

        var gamePaused = this.game.paused;
        this.boardView = new BoardView($e('.board'));
        this.boardView.listener = this;
        this.boardView.board = this.game.board;
        this.boardView.upcomingPiece = this.game.upcomingPiece;
        this.boardView.paused = gamePaused;

        this.gameButton = Button.$('#game-control-game');
        this.gameButton.onClick = this.onGameClicked.bind(this);
        if (gamePaused) {
            this.boardView.tick = this.game.countUp.currentTick;
            this.gameButton.text = "Resume";
        }
    }

    //region Events

    @subscribe(LifeChangedEvent)
    onLifeChanged(change: LifeChangedEvent): void {
        this.statsView.life = change.getValue();
    }

    @subscribe(ScoreChangedEvent)
    onScoreChanged(change: ScoreChangedEvent): void {
        this.statsView.score = change.getValue();
    }

    @subscribe(UpcomingPieceAvailableEvent)
    onUpcomingPieceAvailable(ignored: UpcomingPieceAvailableEvent): void {
        this.boardView.upcomingPiece = this.game.upcomingPiece;
    }

    @subscribe(PowerUpChangedEvent)
    onPowerUpChanged(change: PowerUpChangedEvent): void {
        this.boardView.setPowerUpAvailable(change.getValue(), true);
    }

    @subscribe(PowerUpScheduledEvent)
    onPowerUpScheduled(change: PowerUpScheduledEvent): void {
        this.boardView.setPowerUpActive(change.getValue(), true);
    }

    @subscribe(PowerUpTimerTickEvent)
    onPowerUpTicked(ticked: PowerUpTimerTickEvent): void {
        this.boardView.setPowerUpTick(ticked.powerUp, ticked.ticksRemaining);
    }

    @subscribe(PowerUpExpiredEvent)
    onPowerUpExpired(change: PowerUpExpiredEvent): void {
        this.boardView.setPowerUpAvailable(change.getValue(), false);
    }

    @subscribe(PauseStateChangedEvent)
    onPauseStateChanged(change: PauseStateChangedEvent): void {
        var paused = change.getValue();
        this.boardView.paused = paused;
        if (paused) {
            this.gameButton.text = "Resume";
        } else {
            this.gameButton.text = "Pause";
        }
    }

    @subscribe(CountUpTickedEvent)
    onCountUpTicked(tick: CountUpTickedEvent): void {
        this.boardView.tick = tick.getValue();
    }

    @subscribe(NewGameEvent)
    onNewGame(ignored: NewGameEvent): void {
        this.gameButton.text = "Pause";
        this.boardView.tick = 1;
    }

    @subscribe(GameOverEvent)
    onGameOver(event: GameOverEvent): void {
        this.gameButton.text = "Start";

        this.boardView.upcomingPiece = null;
        this.boardView.tick = 0;
        this.boardView.paused = false;
        PowerUps.forEach(powerUp => {
            this.boardView.setPowerUpAvailable(powerUp, false);
        });
    }

    //endregion

    onSettingsClicked(sender: Button): void {
        console.log("Fonz#onSettingsClicked");
    }

    onHelpClicked(sender: Button): void {
        console.log("Fonz#onHelpClicked");
    }

    onGameClicked(sender: Button): void {
        console.log("Fonz#onGameClicked");

        if (this.game.inProgress) {
            if (this.game.paused) {
                this.game.resume();
            } else {
                this.game.pause();
            }
        } else {
            this.game.newGame();
        }
    }


    onUpcomingPieClicked(): void {
        this.game.skipPiece();
    }

    onPieClicked(pieSlot: number, pie: Pie) {
        this.game.tryPlaceCurrentPiece(pie);
    }

    onPowerUpClicked(powerUp: PowerUp) {
        switch (powerUp) {
            case PowerUp.MULTIPLY_SCORE:
                this.game.multiplyScore();
                break;

            case PowerUp.CLEAR_ALL:
                this.game.clearAll();
                break;

            case PowerUp.SLOW_DOWN_TIME:
                this.game.slowDownTime();
                break;
        }
    }
}