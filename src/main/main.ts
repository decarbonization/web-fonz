///<reference path="widget/Button.ts"/>
///<reference path="widget/StatsView.ts"/>
///<reference path="widget/BoardView.ts"/>


///<reference path="game/Game.ts"/>
///<reference path="util/Bus.ts"/>

class Fonz {
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
        this.statsView.setLife(this.game.life.value);
        this.statsView.setScore(this.game.score.value);

        var gamePaused = this.game.paused;
        this.boardView = new BoardView($e('.board'));
        this.boardView.setBoard(this.game.board);
        this.boardView.setUpcomingPiece(this.game.upcomingPiece);
        this.boardView.setPaused(gamePaused);

        this.gameButton = Button.$('#game-control-game');
        this.gameButton.onClick = this.onGameClicked.bind(this);
        if (gamePaused) {
            this.boardView.setTick(this.game.countUp.currentTick);
            this.gameButton.text = "Resume";
        }
    }

    //region Events

    @subscribe(LifeChangedEvent)
    onLifeChanged(change: LifeChangedEvent): void {
        this.statsView.setLife(change.getValue());
    }

    @subscribe(ScoreChangedEvent)
    onScoreChanged(change: ScoreChangedEvent): void {
        this.statsView.setScore(change.getValue());
    }

    @subscribe(UpcomingPieceAvailableEvent)
    onUpcomingPieceAvailable(ignored: UpcomingPieceAvailableEvent): void {
        this.boardView.setUpcomingPiece(this.game.upcomingPiece);
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
        this.boardView.setPaused(paused);
        if (paused) {
            this.gameButton.text = "Resume";
        } else {
            this.gameButton.text = "Pause";
        }
    }

    @subscribe(CountUpTickedEvent)
    onCountUpTicked(tick: CountUpTickedEvent): void {
        this.boardView.setTick(tick.getValue());
    }

    @subscribe(NewGameEvent)
    onNewGame(ignored: NewGameEvent): void {
        this.gameButton.text = "Pause";
        this.boardView.setTick(1);
    }

    @subscribe(GameOverEvent)
    onGameOver(event: GameOverEvent): void {
        this.gameButton.text = "Start";

        this.boardView.setUpcomingPiece(null);
        this.boardView.setTick(0);
        this.boardView.setPaused(false);
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
}