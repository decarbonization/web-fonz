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


class Life {
    static INITIAL_VALUE: number = 5;

    private _value: number = Life.INITIAL_VALUE;
    private changedEvent: LifeChangedEvent = new LifeChangedEvent(0);

    constructor(private bus: Bus) {
    }

    get value(): number {
        return this._value;
    }

    decrement(): void {
        if (this._value > 0) {
            this._value--;
            this.changedEvent.setValue(this._value);
            this.bus.post(this.changedEvent);
        }
    }

    increment(): void {
        this._value++;
        this.changedEvent.setValue(this._value);
        this.bus.post(this.changedEvent);
    }

    isAlive(): boolean {
        return (this._value > 0);
    }

    reset(): void {
        this._value = Life.INITIAL_VALUE;
        this.changedEvent.setValue(this._value);
        this.bus.post(this.changedEvent);
    }
}

class LifeChangedEvent extends BusValueEvent<number> {
}