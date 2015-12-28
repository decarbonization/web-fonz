var assert = chai.assert;

suite("MockScheduler", () => {
    test("#advanceTo", () => {
        var scheduler = new MockScheduler();
        var fired1 = false, fired2 = false;
        scheduler.schedule(() => { fired1 = true }, 1000);
        scheduler.schedule(() => { fired2 = true }, 2000);

        scheduler.advanceTo(500);
        assert.isFalse(fired1);
        assert.isFalse(fired2);

        scheduler.advanceTo(1000);
        assert.isTrue(fired1);
        assert.isFalse(fired2);

        fired1 = false;
        scheduler.advanceTo(2000);
        assert.isFalse(fired1);
        assert.isTrue(fired2);
    });

    test("#advanceToLast", () => {
        var scheduler = new MockScheduler();
        var fired1 = false, fired2 = false;
        scheduler.schedule(() => { fired1 = true }, 1000);
        scheduler.schedule(() => { fired2 = true }, 2000);

        scheduler.advanceToLast();
        assert.isTrue(fired1);
        assert.isTrue(fired2);
    });

    test("#cancel", () => {
        var scheduler = new MockScheduler();
        var fired = false;
        var tag = scheduler.schedule(() => { fired = true }, 1000);
        scheduler.cancel(tag);

        scheduler.advanceToLast();
        assert.isFalse(fired);
    });
});