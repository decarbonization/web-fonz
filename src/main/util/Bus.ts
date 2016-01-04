const SubscribeTag = "Fonz$Bus$subscribe$tag";

class Subscriber {
    constructor(public target: any, public tag: Function, public callback: (any) => void) {}
}

function subscribe<T>(tag: Function) {
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

    register(target: any, logProperties: boolean = false): void {
        for (var property in target) {
            //noinspection JSUnfilteredForInLoop
            var field: any = target[property];
            if (logProperties) {
                console.debug("found '" + property + "' on '" + target + "'");
            }
            if (field == null || !(field instanceof Object)) {
                if (logProperties) {
                    console.debug("skipping '" + property + "' on '" + target + "'");
                }
                continue;
            }
            if (SubscribeTag in field) {
                var tag: Function = field[SubscribeTag];
                var callback = field.bind(target);
                this.subscribers.push(new Subscriber(target, tag, callback));

                if (logProperties) {
                    console.debug("registering '" + property + "' on " + target);
                }
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