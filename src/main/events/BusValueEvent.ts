///<reference path="BusEvent.ts"/>

abstract class BusValueEvent<T> extends BusEvent {
    constructor(private _value: T) {
        super();
    }

    getValue(): T {
        return this._value;
    }

    toString(): string {
        return "ValueEvent{value=" + this._value + "}";
    }
}