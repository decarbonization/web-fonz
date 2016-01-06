/*
 * Copyright (c) 2015, Peter 'Kevin' MacWhinnie
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions may not be sold, nor may they be used in a commercial
 *    product or activity.
 * 2. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 3. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

enum Piece {
    EMPTY,
    ORANGE,
    GREEN,
    PURPLE,
}

class Pieces {
    static COUNT = 4;
    static FIRST = Piece.EMPTY;
    static forEach(f: (Piece) => void, first: Piece = Pieces.FIRST): void {
        for (var i: Piece = first; i < Pieces.COUNT; i++) {
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
        if (piece == Piece.EMPTY) {
            return '';
        } else {
            return 'piece_' + Slots.getClassPart(slot) + '_' + Pieces.getClassPart(piece);
        }
    }
}