///<reference path="widget/Button.ts"/>
///<reference path="game/Game.ts"/>
///<reference path="util/Bus.ts"/>

class Fonz {
    bus: Bus = new Bus();
    game: Game;
    gameButton: Button;

    run(): void {
        console.log("Fonz#run");

        this.game = new Game(this.bus);

        var settingsButton = Button.$('#game-control-settings');
        settingsButton.onClick = this.onSettingsClicked.bind(this);

        var helpButton = Button.$('#game-control-help');
        helpButton.onClick = this.onHelpClicked.bind(this);

        this.gameButton = Button.$('#game-control-game');
        this.gameButton.onClick = this.onGameClicked.bind(this);
    }

    onSettingsClicked(sender: Button): void {
        console.log("Fonz#onSettingsClicked");
    }

    onHelpClicked(sender: Button): void {
        console.log("Fonz#onHelpClicked");
    }

    onGameClicked(sender: Button): void {
        console.log("Fonz#onGameClicked");
    }
}