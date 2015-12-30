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
}