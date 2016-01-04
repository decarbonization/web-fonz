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

    static forEach(f: (Slot) => void, first: Slot = Slots.FIRST): void {
        for (var slot = first; slot < Slots.COUNT; slot++) {
            f(slot);
        }
    }
    static getClassPart(slot: Slot): string {
        switch (slot) {
            case Slot.TOP_LEFT:
                return 'top_left';
            case Slot.TOP_CENTER:
                return 'top_center';
            case Slot.TOP_RIGHT:
                return 'top_right';
            case Slot.BOTTOM_LEFT:
                return 'bottom_left';
            case Slot.BOTTOM_CENTER:
                return 'bottom_center';
            case Slot.BOTTOM_RIGHT:
                return 'bottom_right';
            default:
                return '';
        }
    }
}