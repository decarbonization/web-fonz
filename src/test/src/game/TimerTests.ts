var assert = chai.assert;

suite("TimerTests", () => {
    const DURATION = 10;

    var clock: lolex.Clock;
    var completed: boolean = false;
    var tickCounter: number = 0;
    var timer: TestTimer;

    setup(() => {
        clock = lolex.install();
        timer = new TestTimer(Scheduler.instance);
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