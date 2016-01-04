///<reference path="View.ts"/>

class StatsView extends View<HTMLDivElement> {
    private _life: HTMLElement;
    private _score: HTMLElement;

    constructor(node: HTMLDivElement) {
        super(node);

        this._life = this.$e('#game-stat-lives');
        this._score = this.$e('#game-stat-score');
    }

    set life(life: number) {
        this._life.innerText = life.toString();
    }

    set score(score: number) {
        this._score.innerText = score.toString();
    }
}