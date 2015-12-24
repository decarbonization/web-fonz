class Score {
    static SCORE_PER_PIECE: number = 10;

    value: number;
    multiplier: number;

    constructor(private bus: Bus) {
        this.value = 0;
        this.multiplier = 1.0;
    }

    addPie(allSameColor: boolean): void {
        var score = Pie.NUMBER_SLOTS * Score.SCORE_PER_PIECE;
        if (allSameColor) {
            score *= 2;
        }
        this.value += Math.round(score * this.multiplier);

        this.bus.post(new ScoreChangedEvent(this.value));
    }

    reset(): void {
        this.value = 0;
        this.multiplier = 1.0;

        this.bus.post(new ScoreChangedEvent(this.value));
    }
}

class ScoreChangedEvent extends BaseValueEvent<number> {
    constructor(value: number) {
        super(value);
    }
}