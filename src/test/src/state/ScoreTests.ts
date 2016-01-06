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