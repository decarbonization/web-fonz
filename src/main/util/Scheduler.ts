declare type Action = () => void;
declare type Milliseconds = number;
declare type ScheduledTask = number;

class Scheduler {
    static schedule(action: Action, delay: Milliseconds): ScheduledTask {
        return window.setTimeout(action, delay);
    }

    static cancel(tag: ScheduledTask): void {
        window.clearTimeout(tag);
    }
}