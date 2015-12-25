var assert = chai.assert;

suite('ScoreTests', () => {
    var bus: Bus;
    var listener: ScoreTestsListener;
    var score: Score;

    setup(() => {
        bus = new Bus();
        listener = new ScoreTestsListener();
        bus.register(listener);
        score = new Score(bus);
    });

    teardown(() => {
        bus.unregister(listener);
    });

    test('#addDifferentColors()', () => {
        assert.equal(score.value, 0);

        score.addPie(false);
        assert.equal(score.value, 60);

        score.addPie(false);
        assert.equal(score.value, 120);

        var scores = listener.events.map((e) => e.getValue());
        assert.deepEqual(scores, [60, 120]);
    });

    test('#addSameColor()', () => {
        assert.equal(score.value, 0);

        score.addPie(true);
        assert.equal(score.value, 120);

        score.addPie(false);
        assert.equal(score.value, 180);

        var scores = listener.events.map((e) => e.getValue());
        assert.deepEqual(scores, [120, 180]);
    });

    test('#multiplier()', () => {
        assert.equal(score.value, 0);

        score.multiplier = 3.0;
        score.addPie(false);
        assert.equal(score.value, 180);

        score.addPie(true);
        assert.equal(score.value, 540);

        var scores = listener.events.map((e) => e.getValue());
        assert.deepEqual(scores, [180, 540]);
    });

    test('#reset()', () => {
        assert.equal(score.value, 0);

        score.multiplier = 3.0;
        score.addPie(false);
        assert.equal(score.value, 180);

        score.reset();
        assert.equal(score.value, 0);
        assert.equal(score.multiplier, 1.0);

        var scores = listener.events.map((e) => e.getValue());
        assert.deepEqual(scores, [180, 0]);
    });
});

class ScoreTestsListener {
    public events: Array<ScoreChangedEvent> = [];

    @subscribe(ScoreChangedEvent)
    onScoreChanged(event: ScoreChangedEvent): void {
        this.events.push(event);
    }
}