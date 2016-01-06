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


class Board {
    static NUMBER_PIES = 6;

    private pies: Array<Pie> = [];
    private powerUps: EnumSet<PowerUp> = EnumSet.empty();

    constructor(private bus: Bus) {
        for (var slot = 0; slot < Board.NUMBER_PIES; slot++) {
            this.pies[slot] = new Pie(bus);
        }
    }

    getSlot(pie: Pie): number {
        return this.pies.indexOf(pie);
    }

    getPie(slot: number): Pie {
        return this.pies[slot];
    }

    pieHasPowerUp(slot: number): boolean {
        return (slot < PowerUps.COUNT);
    }

    addPowerUp(powerUp: PowerUp): boolean {
        if (this.powerUps.set(powerUp)) {
            this.bus.post(new PowerUpChangedEvent(powerUp));

            return true;
        } else {
            return false;
        }
    }

    usePowerUp(powerUp: PowerUp): boolean {
        if (this.powerUps.unset(powerUp)) {
            this.bus.post(new PowerUpChangedEvent(powerUp));

            return true;
        } else {
            return false;
        }
    }

    hasPowerUp(powerUp: PowerUp): boolean {
        return this.powerUps.contains(powerUp);
    }

    getPowerUpCount(): number {
        return this.powerUps.size();
    }

    reset(): void {
        this.pies.forEach((pie) => {
            pie.reset();
        });

        this.powerUps.forEach((powerUp) => {
            this.bus.post(new PowerUpChangedEvent(powerUp));
        });
        this.powerUps.clear();
    }
}

class PowerUpChangedEvent extends BusValueEvent<PowerUp> {
    constructor(value: PowerUp) {
        super(value);
    }
}