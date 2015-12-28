declare type Action = () => void;
declare type Milliseconds = number;

interface Scheduler {
    schedule(action: Action, delay: Milliseconds): Object;
    cancel(tag: Object): void;
}

class TimeoutScheduler implements Scheduler {
    schedule(action: Action, delay: Milliseconds): Object {
        return window.setTimeout(action, delay);
    }

    cancel(tag: Object): void {
        window.clearTimeout(tag as number);
    }
}

class MockScheduler implements Scheduler {
    private enqueued: Array<{action: Action, delay: Milliseconds}> = [];

    schedule(action: Action, delay: Milliseconds): Object {
        var entry = {action: action, delay: delay};
        this.enqueued.push(entry);
        return entry;
    }

    cancel(tag: Object): void {
        var entry = tag as {action: Action, delay: Milliseconds};
        var index = this.enqueued.indexOf(entry);
        if (index > -1) {
            this.enqueued.splice(index, 1);
        }
    }

    advanceTo(amount: Milliseconds): void {
        for (var i = 0; i < this.enqueued.length; i++) {
            var entry = this.enqueued[i];
            if (amount >= entry.delay) {
                entry.action();
                this.enqueued.splice(i, 1);
                i--;
            }
        }
    }

    advanceToLast(): void {
        this.enqueued.forEach(entry => entry.action());
        this.enqueued.splice(0, this.enqueued.length);
    }
}
