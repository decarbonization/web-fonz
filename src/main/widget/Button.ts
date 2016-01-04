///<reference path="ClickableView.ts"/>

class Button extends ClickableView<HTMLButtonElement> {
    static DISABLED_CLASS = 'button-disabled';

    static $(selector: string): Button {
        var node: HTMLButtonElement = $e(selector);
        if (node) {
            return new Button(node);
        } else {
            return null;
        }
    }

    constructor(node: HTMLButtonElement) {
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
}