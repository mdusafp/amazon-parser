/* eslint max-statements-per-line: off, no-empty-function: off */
const test = require('ava');
const hp = require('.');

test('base', t => {
    const obj = {};
    const p = hp(obj);
    p('x', () => obj.a, x => { obj.a = x; });
    t.deepEqual(obj, {});
    t.is(obj.x, undefined);
    obj.x = 1;
    t.is(obj.x, 1);
    t.deepEqual(obj, {a: 1});
    p('y', {get: () => 1});
    t.is(obj.y, 1);
    p('z', {set: z => { obj.b = z; }});
    obj.z = 1;
    t.deepEqual(obj, {a: 1, b: 1});
});

test('descriptor', t => {
    const obj = {};
    const p = hp(obj);
    p('x', () => 1, x => {});
    const d = Reflect.getOwnPropertyDescriptor(obj, 'x');
    t.is(typeof d.get, 'function');
    t.is(typeof d.set, 'function');
    t.is(d.enumerable, false);
    t.is(d.configurable, false);
});

test('errors', t => {
    const obj = {};
    const p = hp(obj);
    p('g', () => 1);
    p('s', x => {});
    t.throws(() => { obj.g = 1; });
    t.throws(() => obj.s);
    t.throws(() => p());
    t.throws(() => p(1));
    t.throws(() => p('name'));
    t.throws(() => p('name', 'bad'));
    t.throws(() => p('name', {}, 'bad'));
});
