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

suite("TimerTests", () => {
    const DURATION = 10;

    var clock: lolex.Clock;
    var completed: boolean = false;
    var tickCounter: number = 0;
    var timer: TestTimer;

    setup(() => {
        clock = lolex.install();
        timer = new TestTimer();
        timer.tickDuration = DURATION;
        timer.tickCount = 10;
    });

    teardown(() => {
        completed = false;
        tickCounter = 0;
        clock.uninstall();
    });


    test("#basicCountUp", () => {
        assert.isFalse(timer.isRunning);

        timer.start();

        clock.tick(DURATION * 4);
        assert.equal(tickCounter, 5);
        assert.isFalse(completed);

        clock.tick(DURATION * 6);
        assert.equal(tickCounter, 10);
        assert.isTrue(completed);
    });

    test("#pause", () => {
        assert.isFalse(timer.isRunning);

        timer.start();

        clock.tick(DURATION * 4);
        assert.equal(tickCounter, 5);
        assert.isFalse(completed);

        timer.pause();
        assert.isTrue(timer.isRunning);

        clock.tick(DURATION * 6);
        assert.equal(tickCounter, 5);
        assert.isFalse(completed);

        timer.resume();
        clock.tick(DURATION * 6);
        assert.equal(tickCounter, 10);
        assert.isTrue(completed);
    });

    
    test("#startAfterPause", () => {
        assert.isFalse(timer.isRunning);

        timer.start();

        clock.tick(DURATION * 4);
        assert.equal(tickCounter, 5);
        assert.isFalse(completed);

        timer.pause();
        assert.isTrue(timer.isRunning);

        clock.tick(DURATION * 6);
        assert.equal(tickCounter, 5);
        assert.isFalse(completed);

        tickCounter = 0;
        timer.start();
        clock.tick(DURATION * 4);
        assert.equal(tickCounter, 5);
        assert.isFalse(completed);

        timer.pause();
        assert.isTrue(timer.isRunning);

        clock.tick(DURATION * 6);
        assert.equal(tickCounter, 5);
        assert.isFalse(completed);
    });

    
    test("#tickDuration", () => {
        assert.isFalse(timer.isRunning);

        timer.tickDuration = 200;
        timer.start();

        clock.tick(200 * 4);
        assert.equal(tickCounter, 5);
        assert.isFalse(completed);

        clock.tick(400 * 6);
        assert.equal(tickCounter, 10);
        assert.isTrue(completed);
    });

    
    test("#tickCount", () => {
        assert.isFalse(timer.isRunning);

        timer.tickCount = 12;
        timer.start();

        clock.tick(DURATION * 4);
        assert.equal(tickCounter, 5);
        assert.isFalse(completed);

        clock.tick(DURATION * 5);
        assert.equal(tickCounter, 10);
        assert.isFalse(completed);

        clock.tick(DURATION * 3);
        assert.equal(tickCounter, 12);
        assert.isTrue(completed);
    });


    class TestTimer extends Timer {
        onTick(tick: number): void {
            tickCounter++;
        }

        onCompleted(): void {
            completed = true;
        }
    }
});