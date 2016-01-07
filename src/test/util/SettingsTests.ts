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

suite("SettingsTests", () => {
    teardown(() => {
        Settings.clear();
    });

    test("#isPersistent", () => {
        assert.isTrue(Settings.persistent);
    });

    test("#string", () => {
        Settings.putPrimitive("name", "John");
        assert.strictEqual(Settings.getString("name"), "John");
    });

    test("#number", () => {
        Settings.putPrimitive("weight", 150);
        assert.strictEqual(Settings.getNumber("weight"), 150);
    });

    test("#json", () => {
        var person = {"name": "John", "weight": 150};
        Settings.putJson("person", person);
        assert.deepEqual(Settings.getJson("person"), person);

        var numbers = [1, 2, 3, 4, 5];
        Settings.putJson("numbers", numbers);
        assert.deepEqual(Settings.getJson("numbers"), numbers);
    });

    test("#clear", () => {
        Settings.putPrimitive("test1", "value1");
        assert.isNotNull(Settings.getString("test1"));
        Settings.putPrimitive("test2", "value2");
        assert.isNotNull(Settings.getString("test2"));

        Settings.clear();
        assert.isNull(Settings.getString("test1"));
        assert.isNull(Settings.getString("test2"));
    });
});
