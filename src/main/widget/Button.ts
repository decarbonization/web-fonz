///<reference path="View.ts"/>

class Button extends View<HTMLButtonElement> {
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

        this.attach('click', this.onClickEvent.bind(this));
    }

    public onClick: (Button) => void = null;

    onClickEvent(): boolean {
        if (this.enabled) {
            if (this.onClick) {
                this.onClick(this);
            }
            return true;
        } else {
            return false;
        }
    }

    get enabled(): boolean {
        return !this.hasClass(Button.DISABLED_CLASS);
    }

    set enabled(enabled: boolean) {
        if (enabled) {
            this.removeClass(Button.DISABLED_CLASS);
        } else {
            this.addClass(Button.DISABLED_CLASS);
        }
    }
}