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

///<reference path="Timer.ts"/>
///<reference path="../util/Bus.ts"/>
///<reference path="../events/BusEvent.ts"/>
///<reference path="../events/BusValueEvent.ts"/>

class CountUp extends Timer {
    public static NUMBER_TICKS = 10;
    public static MIN_TICK_DURATION: Milliseconds = 450;
    public static DEFAULT_SCALE_FACTOR = 0.90;

    private tickEvent: CountUpTickedEvent = new CountUpTickedEvent();
    private completedEvent: CountUpCompletedEvent = new CountUpCompletedEvent();

    constructor(private bus: Bus) {
        super();
    }

    scaleTickDuration(factor: number) {
        var tickDuration = Math.round(this.tickDuration * factor);
        if (tickDuration < CountUp.MIN_TICK_DURATION) {
            tickDuration = CountUp.MIN_TICK_DURATION;
        }

        this.tickDuration = tickDuration;
    }

    stop(): void {
        super.stop();

        this.tickDuration = 1000;
    }

    onTick(tick: number): void {
        this.tickEvent.setValue(tick);
        this.bus.post(this.tickEvent);
    }

    onCompleted(): void {
        this.bus.post(this.completedEvent);
    }
}

class CountUpTickedEvent extends BusValueEvent<number> {
}

class CountUpCompletedEvent extends BusEvent {
}