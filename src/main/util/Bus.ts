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

const SubscribeTag = "Fonz$Bus$subscribe$tag";

class Subscriber {
    constructor(public target: any, public tag: Function, public callback: (any) => void) {}
}

function subscribe<T>(tag: Function) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(T) => void>) => {
        if (descriptor === undefined) {
            descriptor = target[propertyKey];
        }

        var f = descriptor.value;
        f[SubscribeTag] = tag;
        return descriptor;
    };
}

class Bus {
    private subscribers: Array<Subscriber> = [];

    post(object: any): void {
        this.subscribers.forEach((s) => {
            if (object instanceof s.tag) {
                s.callback(object);
            }
        });
    }

    register(target: any, logProperties: boolean = false): void {
        for (var property in target) {
            //noinspection JSUnfilteredForInLoop
            var field: any = target[property];
            if (logProperties) {
                console.debug("found '" + property + "' on '" + target + "'");
            }
            if (field == null || !(field instanceof Object)) {
                if (logProperties) {
                    console.debug("skipping '" + property + "' on '" + target + "'");
                }
                continue;
            }
            if (SubscribeTag in field) {
                var tag: Function = field[SubscribeTag];
                var callback = field.bind(target);
                this.subscribers.push(new Subscriber(target, tag, callback));

                if (logProperties) {
                    console.debug("registering '" + property + "' on " + target);
                }
            }
        }
    }

    unregister(target: any): void {
        for (var i = this.subscribers.length - 1; i >= 0; i--) {
            var subscriber: Subscriber = this.subscribers[i];
            if (subscriber.target == target) {
                this.subscribers.splice(i, 1);
            }
        }
    }
}