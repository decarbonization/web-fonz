enum Slot {
    TOP_LEFT = 0,
    TOP_CENTER,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_CENTER,
    BOTTOM_RIGHT,
}

class Slots {
    static FIRST = Slot.TOP_LEFT;
    static COUNT = 6;

    static forEach(f: (Slot) => void): void {
        for (var slot = Slots.FIRST; slot < Slots.COUNT; slot++) {
            f(slot);
        }
    }
}