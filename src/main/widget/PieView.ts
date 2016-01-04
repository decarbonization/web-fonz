///<reference path="View.ts"/>

class PieView extends View<HTMLDivElement> {
    private slots: Array<HTMLDivElement> = [];
    private pie: Pie;

    constructor(node: HTMLDivElement) {
        super(node);

        Slots.forEach(slot => {
            var child = document.createElement('div');
            node.appendChild(child);
            this.slots[slot] = child;
        });
    }

    setPie(pie: Pie): void {
        if (this.pie != null) {
            var bus = this.pie.bus;
            if (bus != null) {
                bus.unregister(this);
            }
        }

        this.pie = pie;

        if (pie != null) {
            var bus: Bus = pie.bus;
            if (bus != null) {
                bus.register(this);
            }
        }

        this.update();
    }

    private update(): void {
        if (this.pie != null) {
            Slots.forEach(slot => {
                var node = this.slots[slot];
                var piece = this.pie.getPiece(slot);
                node.className = Pieces.getClass(slot, piece);
            });
        } else {
            this.slots.forEach(node => {
                node.className = '';
            });
        }
    }

    @subscribe(PieChangedEvent)
    onPieChanged(event: PieChangedEvent) {
        if (event.pie == this.pie) {
            this.update();
        }
    }
}
