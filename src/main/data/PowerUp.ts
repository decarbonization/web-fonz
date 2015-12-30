enum PowerUp {
    MULTIPLY_SCORE,
    CLEAR_ALL,
    SLOW_DOWN_TIME,
}

class PowerUps {
    static COUNT = 3;

    static forSlot(slot: Slot): PowerUp {
        switch (slot) {
            case Slot.TOP_LEFT:
                return PowerUp.SLOW_DOWN_TIME;
            case Slot.TOP_CENTER:
                return PowerUp.CLEAR_ALL;
            case Slot.TOP_RIGHT:
                return PowerUp.SLOW_DOWN_TIME;
            default:
                return null;
        }
    }
}