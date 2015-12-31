///<reference path="Timer.ts"/>
///<reference path="../util/Bus.ts"/>
///<reference path="../events/BusEvent.ts"/>
///<reference path="../events/BusValueEvent.ts"/>

class CountUp extends Timer {
    public static NUMBER_TICKS = 10;
    public static MIN_TICK_DURATION: Milliseconds = 450;
    public static DEFAULT_SCALE_FACTOR = 0.95;

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
        this.bus.post(new CountUpTickedEvent(tick));
    }

    onCompleted(): void {
        this.bus.post(new CountUpCompletedEvent());
    }
}

class CountUpTickedEvent extends BusValueEvent<number> {
    constructor(value: number) {
        super(value);
    }
}

class CountUpCompletedEvent extends BusEvent {
}