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