var assert = chai.assert;

enum Gender {
    MALE,
    FEMALE,
    OTHER,
}

suite("EnumSetTests", () => {
    test("#empty", () => {
        var s = EnumSet.empty<Gender>();
        assert.isFalse(s.contains(Gender.MALE));
        assert.isFalse(s.contains(Gender.FEMALE));
        assert.isFalse(s.contains(Gender.OTHER));
    });

    test("#of", () => {
        var s = EnumSet.of(Gender.MALE, Gender.OTHER);
        assert.isTrue(s.contains(Gender.MALE));
        assert.isFalse(s.contains(Gender.FEMALE));
        assert.isTrue(s.contains(Gender.OTHER));
    });

    test("#contains", () => {
        var s = EnumSet.of(Gender.MALE);
        assert.isTrue(s.contains(Gender.MALE));
        assert.isFalse(s.contains(Gender.FEMALE));
        assert.isFalse(s.contains(Gender.OTHER));
    });

    test("#set", () => {
        var s = EnumSet.of(Gender.MALE);
        assert.isTrue(s.contains(Gender.MALE));
        assert.isFalse(s.contains(Gender.FEMALE));

        assert.isTrue(s.set(Gender.FEMALE));
        assert.isTrue(s.contains(Gender.FEMALE));
        assert.isFalse(s.set(Gender.FEMALE));
    });

    test("#unset", () => {
        var s = EnumSet.of(Gender.MALE);
        assert.isTrue(s.contains(Gender.MALE));

        assert.isTrue(s.unset(Gender.MALE));
        assert.isFalse(s.contains(Gender.MALE));
        assert.isFalse(s.unset(Gender.MALE));
    });

    test("#size", () => {
        var s = EnumSet.of(Gender.MALE);
        assert.equal(s.size(), 1);

        s.unset(Gender.MALE);
        assert.equal(s.size(), 0);
    });

    test("#clear", () => {
        var s = EnumSet.of(Gender.MALE, Gender.FEMALE, Gender.OTHER);
        assert.equal(s.size(), 3);

        s.clear();
        assert.equal(s.size(), 0);
    });

    test("#forEach", () => {
        var seen: Array<Gender> = [];
        var s = EnumSet.of(Gender.MALE, Gender.FEMALE, Gender.OTHER);
        s.forEach((g) => seen.push(g));

        assert.deepEqual(seen, [Gender.MALE, Gender.FEMALE, Gender.OTHER]);
    });
});