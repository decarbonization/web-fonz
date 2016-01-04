///<reference path="widget/Button.ts"/>
///<reference path="widget/StatsView.ts"/>

///<reference path="game/Game.ts"/>
///<reference path="util/Bus.ts"/>

class Fonz {
    bus: Bus = new Bus();
    game: Game;

    statsView: StatsView;
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

        this.gameButton = Button.$('#game-control-game');
        this.gameButton.onClick = this.onGameClicked.bind(this);
        if (gamePaused) {
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
    }

    @subscribe(PowerUpChangedEvent)
    onPowerUpChanged(change: PowerUpChangedEvent): void {
    }

    @subscribe(PowerUpScheduledEvent)
    onPowerUpScheduled(change: PowerUpScheduledEvent): void {
    }

    @subscribe(PowerUpTimerTickEvent)
    onPowerUpTicked(ticked: PowerUpTimerTickEvent): void {
    }

    @subscribe(PowerUpExpiredEvent)
    onPowerUpExpired(change: PowerUpExpiredEvent): void {
    }

    @subscribe(PauseStateChangedEvent)
    onPauseStateChanged(change: PauseStateChangedEvent): void {
        if (change.getValue()) {
            this.gameButton.text = "Resume";
        } else {
            this.gameButton.text = "Pause";
        }
    }

    @subscribe(CountUpTickedEvent)
    onCountUpTicked(tick: CountUpTickedEvent): void {
    }

    @subscribe(NewGameEvent)
    onNewGame(ignored: NewGameEvent): void {
        this.gameButton.text = "Pause";
    }

    @subscribe(GameOverEvent)
    onGameOver(event: GameOverEvent): void {
        this.gameButton.text = "Start";
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