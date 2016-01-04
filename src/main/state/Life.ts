class Life {
    static INITIAL_VALUE: number = 5;

    private _value: number = Life.INITIAL_VALUE;

    constructor(private bus: Bus) {
    }

    get value(): number {
        return this._value;
    }

    decrement(): void {
        if (this._value > 0) {
            this._value--;
            this.bus.post(new LifeChangedEvent(this._value));
        }
    }

    increment(): void {
        this._value++;
        this.bus.post(new LifeChangedEvent(this._value));
    }

    isAlive(): boolean {
        return (this._value > 0);
    }

    reset(): void {
        this._value = Life.INITIAL_VALUE;
        this.bus.post(new LifeChangedEvent(this._value));
    }
}

class LifeChangedEvent extends BusValueEvent<number> {
    constructor(value: number) {
        super(value);
    }
}