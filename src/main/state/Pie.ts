class Pie {
    private slots: Array<Piece> = [];
    private occupiedSlots: number = 0;

    constructor(private bus: Bus) {
        Slots.forEach((slot) => {
            this.slots[slot] = Piece.EMPTY;
        });
    }

    canPlacePiece(slot: Slot, piece: Piece): boolean {
        return (this.occupiedSlots < Slots.COUNT &&
                this.slots[slot] == Piece.EMPTY);
    }

    tryPlacePiece(slot: Slot, piece: Piece): boolean {
        if (this.occupiedSlots == Slots.COUNT) {
            return false;
        }

        if (this.slots[slot] == Piece.EMPTY) {
            this.slots[slot] = piece;
            this.occupiedSlots++;

            this.bus.post(new PieChangedEvent(this));
            return true;
        } else {
            return false;
        }
    }

    getPiece(offset: Slot): Piece {
        return this.slots[offset];
    }

    getOccupiedSlotCount(): number {
        return this.occupiedSlots;
    }

    isFull(): boolean {
        return (this.occupiedSlots == Slots.COUNT);
    }

    isSingleColor(): boolean {
        if (this.isFull()) {
            var first = this.slots[Slot.TOP_LEFT];
            for (var slot = Slots.FIRST; slot < Slots.COUNT; slot++) {
                if (this.slots[slot] != first) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    reset(): void {
        Slots.forEach((slot) => {
            this.slots[slot] = Piece.EMPTY;
        });
        this.occupiedSlots = 0;

        this.bus.post(new PieChangedEvent(this));
    }
}

class PieChangedEvent {
    constructor(public pie: Pie) {}
}