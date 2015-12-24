var assert = chai.assert;

suite('BusTests', () => {
    var bus: Bus;

    setup(() => {
        bus = new Bus();
    });

    test('#post', () => {
        var listener = new Listener();
        bus.register(listener);

        bus.post(new TestEvent(1));
        bus.post(new TestEvent(2));
        bus.post(new TestEvent(3));

        assert.deepEqual(listener.events.map((e) => e.value), [1, 2, 3]);
    });

    test('#registration', () => {
        var listener = new Listener();
        bus.register(listener);

        bus.post(new TestEvent(1));

        assert.deepEqual(listener.events.map((e) => e.value), [1]);

        bus.unregister(listener);

        bus.post(new TestEvent(2));
        bus.post(new TestEvent(3));

        assert.deepEqual(listener.events.map((e) => e.value), [1]);
    });
});

class TestEvent {
    constructor(public value: number) {}
}

class Listener {
    public events: Array<TestEvent> = [];

    @subscribe(TestEvent)
    onTestEvent(testEvent: TestEvent): void {
        this.events.push(testEvent);
    }
}