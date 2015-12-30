///<reference path="widget/Button.ts"/>

class Fonz {
    gameButton: Button;

    run(): void {
        console.log("Fonz#run");

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