///<reference path="View.ts"/>
///<reference path="../state/Pie.ts"/>
///<reference path="../util/Bus.ts"/>

class PieView extends ClickableView<HTMLDivElement> {
    private slots: Array<HTMLDivElement> = [];
    private _pie: Pie;

    constructor(node: HTMLDivElement) {
        super(node);

        Slots.forEach(slot => {
            var child = document.createElement('div');
            node.appendChild(child);
            this.slots[slot] = child;
        });
    }

    set pie(pie) {
        if (this._pie != null) {
            var bus = this._pie.bus;
            if (bus != null) {
                bus.unregister(this);
            }
        }

        this._pie = pie;

        if (pie != null) {
            var bus: Bus = pie.bus;
            if (bus != null) {
                bus.register(this);
            }
        }

        this.update();
    }


    get pie(): Pie {
        return this._pie;
    }

    private update(): void {
        if (this._pie != null) {
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
    onPieChanged(event: PieChangedEvent): void {
        if (event.pie == this._pie) {
            this.update();
        }
    }
}
