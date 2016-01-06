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

    get currentTick(): number {
        return this._currentTick;
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