class Life {
    static INITIAL_VALUE:number = 5;

    private value:number = Life.INITIAL_VALUE;

    constructor(private bus:Bus) {
    }

    getValue():number {
        return this.value;
    }

    decrement():void {
        if (this.value > 0) {
            this.value--;
            this.bus.post(new LifeChangedEvent(this.value));
        }
    }

    increment():void {
        this.value++;
        this.bus.post(new LifeChangedEvent(this.value));
    }

    isAlive():boolean {
        return (this.value > 0);
    }

    reset():void {
        this.value = Life.INITIAL_VALUE;
        this.bus.post(new LifeChangedEvent(this.value));
    }
}

class LifeChangedEvent extends BusValueEvent<number> {
    constructor(value:number) {
        super(value);
    }
}