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