///<reference path="ClickableView.ts"/>

class PowerUpView extends ClickableView<HTMLDivElement> {
    static DISABLED_CLASS = 'power-up-disabled';

    constructor(node: HTMLDivElement) {
        super(node);
    }

    get enabled(): boolean {
        return !this.hasClass(Button.DISABLED_CLASS);
    }

    set enabled(enabled: boolean) {
        this.clickable = enabled;
        if (enabled) {
            this.removeClass(Button.DISABLED_CLASS);
        } else {
            this.addClass(Button.DISABLED_CLASS);
        }
    }

    public tick: number = 0;
}