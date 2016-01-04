class PieceFactory {
    static COUNT_PER_COLOR = 30;
    static COUNT_PER_SLOT = 20;

    private pieces: Array<Piece> = [];
    private slots: Array<number> = [];

    private lastSlot: number = Slots.COUNT;

    public preventDuplicatePieces: boolean = true;

    constructor() {
        this.populateSlots();
        this.populateSlots();
    }

    private static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    generatePiece(): Piece {
        if (this.pieces.length == 0) {
            this.populatePieces();
        }

        var position = PieceFactory.randomInt(0, this.pieces.length);
        var piece = this.pieces[position];
        this.pieces.splice(position, 1);
        return piece;
    }

    generateSlot(): Slot {
        if (this.slots.length == 0) {
            this.populateSlots();
        }

        var position = PieceFactory.randomInt(0, this.slots.length);
        var slot = this.slots[position];
        this.slots.splice(position, 1);
        return slot;
    }

    generateUniqueSlot(): Slot {
        var slot: Slot;
        //noinspection StatementWithEmptyBodyJS
        while ((slot = this.generateSlot()) == this.lastSlot);
        this.lastSlot = slot;
        return slot;
    }

    generateUpcomingPiece(): UpcomingPiece {
        if (this.preventDuplicatePieces) {
            return new UpcomingPiece(this.generatePiece(), this.generateUniqueSlot());
        } else {
            return new UpcomingPiece(this.generatePiece(), this.generateSlot());
        }
    }


    reset() {
        this.pieces.splice(0, this.slots.length);
        this.populatePieces();

        this.slots.splice(0, this.slots.length);
        this.populateSlots();

        this.lastSlot = Slots.COUNT;
    }

    private populatePieces(): void {
        Pieces.forEach(color => {
            for (var i = 0; i < PieceFactory.COUNT_PER_COLOR; i++) {
                this.pieces.push(color);
            }
        }, Piece.ORANGE);
    }

    private populateSlots(): void {
        Slots.forEach(slot => {
            for (var i = 0; i < PieceFactory.COUNT_PER_SLOT; i++) {
                this.slots.push(slot);
            }
        });
    }
}