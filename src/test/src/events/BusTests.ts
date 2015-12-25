var assert = chai.assert;

suite('BusTests', () => {
    var bus: Bus;

    setup(() => {
        bus = new Bus();
    });

    test('#post', () => {
        var listener = new BusTestsListener();
        bus.register(listener);

        bus.post(new BusTestEvent(1));
        bus.post(new BusTestEvent(2));
        bus.post(new BusTestEvent(3));

        assert.deepEqual(listener.events.map((e) => e.value), [1, 2, 3]);
    });

    test('#registration', () => {
        var listener = new BusTestsListener();
        bus.register(listener);

        bus.post(new BusTestEvent(1));

        assert.deepEqual(listener.events.map((e) => e.value), [1]);

        bus.unregister(listener);

        bus.post(new BusTestEvent(2));
        bus.post(new BusTestEvent(3));

        assert.deepEqual(listener.events.map((e) => e.value), [1]);
    });
});

class BusTestEvent {
    constructor(public value: number) {}
}

class BusTestsListener {
    public events: Array<BusTestEvent> = [];

    @subscribe(BusTestEvent)
    onTestEvent(testEvent: BusTestEvent): void {
        this.events.push(testEvent);
    }
}