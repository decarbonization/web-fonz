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

        var piesNodes: NodeListOf<HTMLDivElement> = this.$es('.pie');
        for (var i = 0, length = piesNodes.length; i < length; i++) {
            var pieNode = piesNodes[i];
            var pieView = new PieView(pieNode);
            pieView.tag = +(pieNode.dataset['pieN']);
            pieView.onClick = this.onPieClicked.bind(this);
            this.pieViews.push(pieView);
        }
        this.pieViews.sort((l, r) => l.tag - r.tag);

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

        var upcomingNode: HTMLCanvasElement = this.$e('.upcoming-timer');
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
        this.upcomingPieceView.tick = tick;
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
