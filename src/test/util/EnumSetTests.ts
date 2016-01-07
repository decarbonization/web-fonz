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