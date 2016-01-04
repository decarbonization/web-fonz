///<reference path="View.ts"/>

class UpcomingPieceView extends ClickableView<HTMLDivElement> {
    private _upcomingPiece: UpcomingPiece = null;
    private _paused: boolean = false;
    private _pieceNode: HTMLDivElement;

    constructor(node: HTMLDivElement) {
        super(node);

        this._pieceNode = document.createElement('div');
        node.appendChild(this._pieceNode);
    }


    get upcomingPiece(): UpcomingPiece {
        return this._upcomingPiece;
    }

    set upcomingPiece(value: UpcomingPiece) {
        this._upcomingPiece = value;
        if (value != null) {
            this._pieceNode.className = Pieces.getClass(value.slot, value.piece);
        } else {
            this._pieceNode.className = '';
        }
    }

    get paused(): boolean {
        return this._paused;
    }

    set paused(paused: boolean) {
        this._paused = paused;

        if (paused) {
            this._pieceNode.style.visibility = 'none';
        } else {
            this._pieceNode.style.visibility = 'block';
        }
    }

    setTick(tick: number): void {
        console.log("UpcomingPieceView#setTick(" + tick + ")");
    }
}