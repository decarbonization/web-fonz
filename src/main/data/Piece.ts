enum Piece {
    EMPTY,
    ORANGE,
    GREEN,
    PURPLE,
}

class Pieces {
    static COUNT = 4;
    static FIRST = Piece.EMPTY;
    static forEach(f: (Piece) => void): void {
        for (var i: Piece = Pieces.FIRST; i < Pieces.COUNT; i++) {
            f(i);
        }
    }
    static getClassPart(piece: Piece): string {
        switch (piece) {
            case Piece.ORANGE:
                return 'orange';
            case Piece.GREEN:
                return 'green';
            case Piece.PURPLE:
                return 'purple';
            default:
                return '';
        }
    }
    static getClass(slot: Slot, piece: Piece): string {
        return 'piece_' + Slots.getClassPart(slot) + '_' + Pieces.getClassPart(piece);
    }
}