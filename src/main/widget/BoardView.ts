///<reference path="View.ts"/>
///<reference path="PieView.ts"/>
///<reference path="UpcomingPieceView.ts"/>

class BoardView extends View<HTMLDivElement> {
    private pieViews: Array<PieView> = [];
    private upcomingPieceView: UpcomingPieceView;
    private _board: Board;

    constructor(node: HTMLDivElement) {
        super(node);

        var pies: NodeListOf<HTMLDivElement> = this.$es('.pie');
        for (var i = 0, length = pies.length; i < length; i++) {
            ((pieView) => {
                pieView.tag = i;
                pieView.onClick = this.onPieClicked.bind(this);
                this.pieViews.push(pieView);
            })(new PieView(pies[i]));
        }
        this.pieViews.sort((l, r) => l.className.localeCompare(r.className));

        var upcomingNode: HTMLDivElement = this.$e('.upcoming');
        this.upcomingPieceView = new UpcomingPieceView(upcomingNode);
        this.upcomingPieceView.onClick = this.onUpcomingPieceClicked.bind(this);
    }

    public listener: BoardViewListener = null;

    set board(board: Board) {
        this._board = board;

        for (var i = 0; i < Board.NUMBER_PIES; i++) {
            this.pieViews[i].pie = board.getPie(i);
        }

        /*for (final PowerUp powerUp : PowerUp.values()) {
            powerUpButtons.get(powerUp).setEnabled(board.hasPowerUp(powerUp));
        }*/
    }

    get board(): Board {
        return this._board;
    }

    set upcomingPiece(upcomingPiece: UpcomingPiece) {
        this.upcomingPieceView.upcomingPiece = upcomingPiece;
    }
    
    set paused(isPaused: boolean) {
        this.upcomingPieceView.paused = isPaused;
    
        /*for (int i = 0, size = powerUpButtons.size(); i < size; i++) {
            powerUpButtons.valueAt(i).setClickable(!isPaused);
        }*/
        this.pieViews.forEach(pieView => {
            pieView.clickable = !isPaused;
        });
    }

    set tick(tick: number) {
        this.upcomingPieceView.setTick(tick);
    }

    setPowerUpAvailable(powerUp: PowerUp, available: boolean): void {
        //powerUpButtons.get(powerUp).setEnabled(available);
    }

    setPowerUpActive(powerUp: PowerUp, active: boolean): void {
        /*final PowerUpButton powerUpButton = powerUpButtons.get(powerUp);
        if (active) {
            powerUpButton.setTick(PowerUpTimer.STANDARD_NUMBER_TICKS);
            powerUpButton.setClickable(false);
        } else {
            powerUpButton.setTick(0);
            powerUpButton.setClickable(true);
        }*/
    }

    setPowerUpTick(powerUp: PowerUp, tick: number): void {
        //powerUpButtons.get(powerUp).setTick(tick);
    }

    private onPieClicked(sender: PieView): void {
        if (this.listener != null) {
            var slot = sender.tag as number;
            this.listener.onPieClicked(slot, sender.pie);
        }
    }

    private onUpcomingPieceClicked(): void {
        if (this.listener != null) {
            this.listener.onUpcomingPieClicked();
        }
    }
}

interface BoardViewListener {
    onUpcomingPieClicked(): void;
    onPieClicked(pieSlot: number, pie: Pie);
    onPowerUpClicked(powerUp: PowerUp);
}
