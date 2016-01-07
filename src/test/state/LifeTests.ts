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