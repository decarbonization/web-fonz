///<reference path="View.ts"/>

class StatsView extends View<HTMLDivElement> {
    private life: HTMLElement;
    private score: HTMLElement;

    constructor(node: HTMLDivElement) {
        super(node);

        this.life = node.querySelector('#game-stat-lives') as HTMLElement;
        this.score = node.querySelector('#game-stat-score') as HTMLElement;
    }

    setLife(life: number): void {
        this.life.innerText = life.toString();
    }

    setScore(score: number): void {
        this.score.innerText = score.toString();
    }
}