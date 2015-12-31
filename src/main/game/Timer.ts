///<reference path="../util/Scheduler.ts"/>

abstract class Timer {
    private _tickDuration: Milliseconds = 1000;
    private _tickCount = 60;

    private _running: boolean = false;
    private _paused: boolean = false;

    private _currentTick: number = 0;
    private _task: ScheduledTask = null;

    get tickDuration(): Milliseconds {
        return this._tickDuration;
    }

    set tickDuration(value: Milliseconds) {
        this._tickDuration = value;

        Scheduler.cancel(this._task);
        if (this.isRunning && !this.isPaused) {
            this._task = Scheduler.schedule(this._tick.bind(this), this.tickDuration);
        }
    }

    get tickCount(): number {
        return this._tickCount;
    }

    set tickCount(value: number) {
        this._tickCount = value;
        this._currentTick = 0;
    }

    public get isRunning(): boolean {
        return this._running;
    }
    public get isPaused(): boolean {
        return this._paused;
    }

    start(): void {
        this._running = true;
        this._paused = false;

        this._currentTick = 1;

        Scheduler.cancel(this._task);
        this._task = Scheduler.schedule(this._tick.bind(this), this.tickDuration);

        this.onTick(this._currentTick);
    }

    resume(): void {
        if (this.isPaused) {
            Scheduler.cancel(this._task);
            this._task = Scheduler.schedule(this._tick.bind(this), this.tickDuration);
        }
    }

    pause(): void {
        Scheduler.cancel(this._task);
        this._paused = true;
    }

    stop(): void {
        Scheduler.cancel(this._task);

        this._running = false;
        this._paused = false;
        this._currentTick = 1;
    }

    private _tick(): void {
        if (++this._currentTick <= this.tickCount) {
            this.onTick(this._currentTick);
            this._task = Scheduler.schedule(this._tick.bind(this), this.tickDuration);
        } else {
            this.stop();
            this.onCompleted();
        }
    }

    abstract onTick(tick: number): void;
    abstract onCompleted(): void;
}