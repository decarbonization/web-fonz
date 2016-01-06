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