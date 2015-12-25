abstract class BaseValueEvent<T> extends BaseEvent {
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