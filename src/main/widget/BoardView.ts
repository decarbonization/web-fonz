///<reference path="View.ts"/>
///<reference path="PieView.ts"/>
///<reference path="UpcomingPieceView.ts"/>
///<reference path="PowerUpView.ts"/>


class BoardView extends View<HTMLDivElement> {
    private pieViews: Array<PieView> = [];
    private powerUpViews: Array<PowerUpView> = [];
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

        var powerUpViewOnClick = this.onPowerUpClicked.bind(this);
        var powerUp2x = new PowerUpView(this.$e('.power-up-2x'));
        powerUp2x.tag = PowerUp.MULTIPLY_SCORE;
        powerUp2x.onClick = powerUpViewOnClick;
        this.powerUpViews.push(powerUp2x);
        var powerUpClear = new PowerUpView(this.$e('.power-up-clear'));
        powerUpClear.tag = PowerUp.CLEAR_ALL;
        powerUpClear.onClick = powerUpViewOnClick;
        this.powerUpViews.push(powerUpClear);
        var powerUpTimer = new PowerUpView(this.$e('.power-up-timer'));
        powerUpTimer.tag = PowerUp.SLOW_DOWN_TIME;
        powerUpTimer.onClick = powerUpViewOnClick;
        this.powerUpViews.push(powerUpTimer);

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

        this.powerUpViews.forEach(powerUpView => {
            powerUpView.enabled = board.hasPowerUp(powerUpView.tag as PowerUp);
        });
    }

    get board(): Board {
        return this._board;
    }

    set upcomingPiece(upcomingPiece: UpcomingPiece) {
        this.upcomingPieceView.upcomingPiece = upcomingPiece;
    }
    
    set paused(isPaused: boolean) {
        this.upcomingPieceView.paused = isPaused;

        this.powerUpViews.forEach(powerUpView => {
            powerUpView.clickable = !isPaused;
        });
        this.pieViews.forEach(pieView => {
            pieView.clickable = !isPaused;
        });
    }

    set tick(tick: number) {
        this.upcomingPieceView.setTick(tick);
    }

    setPowerUpAvailable(powerUp: PowerUp, available: boolean): void {
        this.powerUpViews[powerUp].enabled = available;
    }

    setPowerUpActive(powerUp: PowerUp, active: boolean): void {
        var powerUpButton: PowerUpView = this.powerUpViews[powerUp];
        if (active) {
            powerUpButton.tick = PowerUpTimer.STANDARD_NUMBER_TICKS;
            powerUpButton.clickable = false;
        } else {
            powerUpButton.tick = 0;
            powerUpButton.clickable = true;
        }
    }

    setPowerUpTick(powerUp: PowerUp, tick: number): void {
        this.powerUpViews[powerUp].tick = tick;
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

    private onPowerUpClicked(sender: PowerUpView): void {
        if (this.listener != null) {
            this.listener.onPowerUpClicked(sender.tag as PowerUp);
        }
    }
}

interface BoardViewListener {
    onUpcomingPieClicked(): void;
    onPieClicked(pieSlot: number, pie: Pie);
    onPowerUpClicked(powerUp: PowerUp);
}
