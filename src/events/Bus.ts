const SubscribeTag = "$Bus#Subscribe";

class Subscriber {
    constructor(public target: any, public tag: any, public callback: (any) => void) {}
}

function subscribe<T>(tag: any) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(T) => void>) => {
        if (descriptor === undefined) {
            descriptor = target[propertyKey];
        }

        var f = descriptor.value;
        f[SubscribeTag] = tag;
        return descriptor;
    };
}

class Bus {
    private subscribers: Array<Subscriber> = [];

    post(object: any): void {
        this.subscribers.forEach((s) => {
            if (object instanceof s.tag) {
                s.callback(object);
            }
        });
    }

    register(target: any): void {
        for (var property in target) {
            //noinspection JSUnfilteredForInLoop
            var field: any = target[property];
            if (SubscribeTag in field) {
                var tag: any = field[SubscribeTag];
                var callback = field.bind(target);
                this.subscribers.push(new Subscriber(target, tag, callback));
            }
        }
    }

    unregister(target: any): void {
        for (var i = this.subscribers.length - 1; i >= 0; i--) {
            var subscriber: Subscriber = this.subscribers[i];
            if (subscriber.target == target) {
                this.subscribers.splice(i, 1);
            }
        }
    }
}