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