var assert = chai.assert;

suite("PowerUpTimerTests", () => {
    var clock: lolex.Clock;
    var listener: PowerUpTimerTestsListener;
    var bus: Bus;
    var powerUpTimer: PowerUpTimer;

    setup(() => {
        clock = lolex.install();
        listener = new PowerUpTimerTestsListener();
        bus = new Bus();
        powerUpTimer = new PowerUpTimer(bus);

        bus.register(listener);
    });

    teardown(() => {
        bus.unregister(listener);
        clock.uninstall();
    });

    test("#schedule", () => {
        powerUpTimer.schedulePowerUp(PowerUp.SLOW_DOWN_TIME,
                                     PowerUpTimer.STANDARD_NUMBER_TICKS);
        assert.isTrue(powerUpTimer.isPending(PowerUp.SLOW_DOWN_TIME));

        clock.tick(PowerUpTimer.TICK_DURATION * PowerUpTimer.STANDARD_NUMBER_TICKS + 100);
        assert.equal(listener.events.length, 2);
        assert.include(listener.events, new PowerUpScheduledEvent(PowerUp.SLOW_DOWN_TIME));
        assert.include(listener.events, new PowerUpExpiredEvent(PowerUp.SLOW_DOWN_TIME));
        assert.isFalse(powerUpTimer.isPending(PowerUp.SLOW_DOWN_TIME));
    });

    test("#stop", () => {
        powerUpTimer.schedulePowerUp(PowerUp.SLOW_DOWN_TIME,
                                     PowerUpTimer.STANDARD_NUMBER_TICKS);
        assert.isTrue(powerUpTimer.isPending(PowerUp.SLOW_DOWN_TIME));
        powerUpTimer.stop();

        clock.tick(PowerUpTimer.TICK_DURATION * PowerUpTimer.STANDARD_NUMBER_TICKS + 100);
        assert.equal(listener.events.length, 1);
        assert.isFalse(powerUpTimer.isPending(PowerUp.SLOW_DOWN_TIME));
    });


    class PowerUpTimerTestsListener {
        public events: Array<BusEvent> = [];

        @subscribe(PowerUpScheduledEvent)
        onPowerUpScheduled(event: PowerUpScheduledEvent): void {
            this.events.push(event);
        }

        @subscribe(PowerUpExpiredEvent)
        onPowerUpExpired(event: PowerUpScheduledEvent): void {
            this.events.push(event);
        }
    }
});