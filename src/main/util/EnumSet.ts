class EnumSet<E extends number> {
    private fields: Array<E> = [];

    static empty<E extends number>(): EnumSet<E> {
        return new EnumSet<E>();
    }

    static of<E extends number>(...fs: Array<E>): EnumSet<E> {
        var s: EnumSet<E> = new EnumSet<E>();
        s.set(...fs);
        return s;
    }

    set(...fs: Array<E>): boolean {
        var changed = false;
        fs.forEach((f) => {
            var index = f as number;
            if (!this.fields[index]) {
                this.fields[index] = f;
                changed = true;
            }
        });
        return changed;
    }

    unset(...fs: Array<E>): boolean {
        var changed = false;
        fs.forEach((f) => {
            var index = this.fields.indexOf(f);
            if (index > -1) {
                this.fields.splice(index, 1);
                changed = true;
            }
        });
        return changed;
    }

    clear(): void {
        this.fields.splice(0, this.fields.length);
    }

    contains(f: E): boolean {
        return (this.fields.indexOf(f) > -1);
    }

    size(): number {
        return this.fields.length;
    }

    forEach(f: (E) => void): void {
        this.fields.forEach(f);
    }
}