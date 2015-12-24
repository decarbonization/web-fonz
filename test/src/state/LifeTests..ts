var assert = chai.assert;

suite('LifeTests', () => {
    var bus: Bus;
    var listener: LifeTestsListener;
    var life: Life;

    setup(() => {
        bus = new Bus();
        listener = new LifeTestsListener();
        bus.register(listener);
        life = new Life(bus);
    });

    teardown(() => {
        bus.unregister(listener);
    });

    test('#isAlive', () => {
        assert.equal(life.isAlive(), true);

        life.decrement();
        assert.include(listener.events, new LifeChangedEvent(4));
        life.decrement();
        assert.include(listener.events, new LifeChangedEvent(3));
        life.decrement();
        assert.include(listener.events, new LifeChangedEvent(2));
        life.decrement();
        assert.include(listener.events, new LifeChangedEvent(1));
        life.decrement();
        assert.include(listener.events, new LifeChangedEvent(0));

        assert.equal(life.isAlive(), false);

        listener.events.splice(0, listener.events.length);
        life.increment();
        assert.include(listener.events, new LifeChangedEvent(1));

        assert.equal(life.isAlive(), true);
    });

    test('#reset', () => {
        life.decrement();
        life.decrement();
        life.decrement();
        life.decrement();
        life.decrement();

        assert.equal(life.isAlive(), false);

        listener.events.splice(0, listener.events.length);
        life.reset();
        assert.include(listener.events, new LifeChangedEvent(5));

        assert.equal(life.isAlive(), true);
    });
});

class LifeTestsListener {
    public events: Array<LifeChangedEvent> = [];

    @subscribe(LifeChangedEvent)
    onLifeChanged(event: LifeChangedEvent): void {
        this.events.push(event);
    }
}