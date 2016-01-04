///<reference path="View.ts"/>

class ClickableView<N extends HTMLElement> extends View<N> {
    constructor(node: N) {
        super(node);

        this.addEventListener(View.EVENT_CLICK, this.dispatchClick.bind(this));
    }

    public onClick: (This?, Event?) => void = null;
    public clickable: boolean = true;

    dispatchClick(e: Event): boolean {
        if (this.clickable) {
            if (this.onClick) {
                this.onClick(this, e);
            }
            return true;
        } else {
            return false;
        }
    }
}