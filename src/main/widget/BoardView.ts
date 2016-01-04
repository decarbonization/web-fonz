///<reference path="View.ts"/>
///<reference path="PieView.ts"/>

class BoardView extends View<HTMLDivElement> {
    private pieViews: Array<PieView> = [];
    private board: Board;

    constructor(node: HTMLDivElement) {
        super(node);

        var pies = node.querySelectorAll('.pie');
        for (var i = 0, length = pies.length; i < length; i++) {
            this.pieViews.push(new PieView(pies[i] as HTMLDivElement));
        }
        this.pieViews.sort((l, r) => {
            return l.node.className.localeCompare(r.node.className);
        });
    }


    setBoard(board: Board): void {
        this.board = board;

        for (var i = 0; i < Board.NUMBER_PIES; i++) {
            this.pieViews[i].setPie(board.getPie(i));
        }

        /*for (final PowerUp powerUp : PowerUp.values()) {
            powerUpButtons.get(powerUp).setEnabled(board.hasPowerUp(powerUp));
        }*/
    }

    setUpcomingPiece(upcomingPiece: UpcomingPiece): void {
        //upcomingPieceView.setUpcomingPiece(upcomingPiece);
    }
    
    setPaused(isPaused: boolean): void {
        /*upcomingPieceView.setPaused(isPaused);
    
        for (int i = 0, size = powerUpButtons.size(); i < size; i++) {
            powerUpButtons.valueAt(i).setClickable(!isPaused);
        }
        for (final PieView pieView : pieViews) {
            pieView.setClickable(!isPaused);
        }*/
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
    
    setTick(tick: number) {
        //upcomingPieceView.setTick(tick);
    }
}
