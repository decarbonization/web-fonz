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
///<reference path="../data/PowerUp.ts"/>

class PowerUpTimer extends Timer {
    static STANDARD_NUMBER_TICKS: number = 60;
    static TICK_DURATION: Milliseconds = 500;

    private scheduled: Array<PowerUpTimerTickEvent> = [];

    constructor(private bus: Bus) {
        super();
        this.tickDuration = PowerUpTimer.TICK_DURATION;
    }


    schedulePowerUp(powerUp: PowerUp, numberOfTicks: number): void {
        this.scheduled.push(new PowerUpTimerTickEvent(powerUp, numberOfTicks, 1));
        this.bus.post(new PowerUpScheduledEvent(powerUp));

        this.tickCount = numberOfTicks;
        if (!this.isRunning) {
            this.start();
        }
    }

    stop(): void {
        super.stop();
        this.scheduled.splice(0, this.scheduled.length);
    }

    isPending(powerUp: PowerUp): boolean {
        return this.scheduled.some(p => p.powerUp == powerUp);
    }


    onTick(tick: number): void {
        for (var i = 0; i < this.scheduled.length; i++) {
            var powerUpTicked = this.scheduled[i];
            if (++powerUpTicked.currentTick >= powerUpTicked.numberOfTicks) {
                this.scheduled.splice(i, 1);
                i--;
                this.bus.post(new PowerUpExpiredEvent(powerUpTicked.powerUp));
            } else {
                this.bus.post(powerUpTicked);
            }
        }
    }

    onCompleted(): void {
        // Do nothing.
    }
}

class PowerUpTimerTickEvent extends BusEvent {
    constructor(public powerUp: PowerUp,
                public numberOfTicks: number,
                public currentTick: number) {
        super();
    }

    get ticksRemaining(): number {
        return (this.numberOfTicks - this.currentTick);
    }
}

class PowerUpScheduledEvent extends BusValueEvent<PowerUp> {
}

class PowerUpExpiredEvent extends BusValueEvent<PowerUp> {
}