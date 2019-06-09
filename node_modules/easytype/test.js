const test = require('ava');
const type = require('.');

test('Base', t => {
    t.is(type(), 'Undefined');
    t.is(type(undefined), 'Undefined');
    t.is(type(void 0), 'Undefined');

    t.is(type(null), 'Null');

    t.is(type(''), 'String');

    t.is(type(true), 'Boolean');
    t.is(type(false), 'Boolean');
    t.is(type(Boolean()), 'Boolean');
    t.is(type(Boolean(1)), 'Boolean');
    t.is(type(new Boolean()), 'Boolean');

    t.is(type(0), 'Number');
    t.is(type(-1.5), 'Number');
    t.is(type(NaN), 'Number');
    t.is(type(Infinity), 'Number');
    t.is(type(Number()), 'Number');
    t.is(type(Number(-1.5)), 'Number');
    t.is(type(Number('-1.5')), 'Number');
    t.is(type(Number(true)), 'Number');
    t.is(type(Number('1string')), 'Number');
    t.is(type(Number('string')), 'Number');
    t.is(type(new Number()), 'Number');

    t.is(type(Symbol('test')), 'Symbol');
    t.is(type(Symbol()), 'Symbol');

    t.is(type({}), 'Object');
    t.is(type(Object()), 'Object');
    t.is(type(new Object()), 'Object');
    t.is(type(Object.create(null)), 'Object');

    t.is(type(Math), 'Math');
    t.is(type(JSON), 'JSON');

    t.is(type([]), 'Array');
    t.is(type(Array()), 'Array');
    t.is(type(new Array()), 'Array');
    t.is(type([...'123']), 'Array');

    t.is(type(() => {}), 'Function');
    t.is(type(function(){}), 'Function');
    t.is(type(Object), 'Function');
    t.is(type(new Function()), 'Function');
    t.is(type(new Function('return 0;')), 'Function');
    t.is(type(new Function('a', 'return a;')), 'Function');

    t.is(type(/^.*$/), 'RegExp');
    t.is(type(new RegExp('^.*$')), 'RegExp');
    t.is(type(new RegExp('ab+c', 'ig')), 'RegExp');

    t.is(type(new Date()), 'Date');
    t.is(type(new Date(0)), 'Date');
    t.is(type(new Date('Sat Dec 23 2017 18:44:45 GMT+0300 (MSK)')), 'Date');
    t.is(type(new Date(2017, 12, 23, 18, 44, 45, 0)), 'Date');

    t.is(type(new Set()), 'Set');
    t.is(type(new Map()), 'Map');
    t.is(type(new WeakSet()), 'WeakSet');
    t.is(type(new WeakMap()), 'WeakMap');

    t.is(type(new Error()), 'Error');
    t.is(type(new EvalError()), 'Error');
    t.is(type(new RangeError()), 'Error');
    t.is(type(new ReferenceError()), 'Error');
    t.is(type(new SyntaxError()), 'Error');
    t.is(type(new TypeError()), 'Error');
    t.is(type(new URIError()), 'Error');

    t.is(type(new Int8Array()), 'Int8Array');
    t.is(type(new Uint8Array()), 'Uint8Array');
    t.is(type(new Uint8ClampedArray()), 'Uint8ClampedArray');
    t.is(type(new Int16Array()), 'Int16Array');
    t.is(type(new Uint16Array()), 'Uint16Array');
    t.is(type(new Int32Array()), 'Int32Array');
    t.is(type(new Uint32Array()), 'Uint32Array');
    t.is(type(new Float32Array()), 'Float32Array');
    t.is(type(new Float64Array()), 'Float64Array');

    t.is(type(new Promise(() => {})), 'Promise');
    t.is(type(Promise.resolve(1)), 'Promise');
    t.is(type(Promise.reject(new Error()).catch(e => {})), 'Promise');
});

test('Shortcuts', t => {
    t.true(type.isUndefined());
    t.true(type.isDefined('test'));
    t.true(type.isNull(null));
    t.true(type.isString(''));
    t.true(type.isBoolean(true));
    t.true(type.isNumber(1));
    t.true(type.isSymbol(Symbol('test')));
    t.true(type.isObject({}));
    t.true(type.isArray([]));
    t.true(type.isFunction(() => {}));
    t.true(type.isRegExp(/^.*$/));
    t.true(type.isDate(new Date()));
    t.true(type.isSet(new Set()));
    t.true(type.isMap(new Map()));
    t.true(type.isWeakSet(new WeakSet()));
    t.true(type.isWeakMap(new WeakMap()));
    t.true(type.isError(new Error()));
    t.true(type.isPromise(new Promise(() => {})));

    t.false(type.isUndefined('test'));
    t.false(type.isDefined());
    t.false(type.isNull('null'));
    t.false(type.isString(true));
    t.false(type.isBoolean('true'));
    t.false(type.isNumber('1'));
    t.false(type.isSymbol([Symbol('test')]));
    t.false(type.isObject(null));
    t.false(type.isArray({length: 1}));
    t.false(type.isFunction(global));
    t.false(type.isRegExp('/^.*$/'));
    t.false(type.isDate('Sat Dec 23 2017 18:44:45 GMT+0300 (MSK)'));
    t.false(type.isSet(new WeakSet()));
    t.false(type.isMap(new WeakMap()));
    t.false(type.isWeakSet(new Set()));
    t.false(type.isWeakMap(new Map()));
    t.false(type.isError(Error));
    t.false(type.isPromise(Promise.all));
});

test('Advanced', t => {
    // numbers
    t.false(type.isNumber.finite(NaN));
    t.false(type.isNumber.finite(Infinity));
    t.false(type.isNumber.finite(-Infinity));
    t.true(type.isNumber.finite(0));
    t.true(type.isNumber.finite(2e64));
    t.true(type.isNumber.finite(-1.5));

    // NaN
    t.true(type.isNaN(NaN));
    t.false(type.isNaN('NaN'));
    t.false(type.isNaN(Infinity));
    t.false(type.isNaN());
    t.false(type.isNaN(0));
    t.false(type.isNaN(null));
    t.false(type.isNaN([NaN]));

    const o = Object.create(null);
    function F(){}

    // pure
    t.true(type.isObject.pure(o));

    t.false(type.isObject.pure({}));
    t.false(type.isObject.pure(Object()));
    t.false(type.isObject.pure(new Object()));
    t.false(type.isObject.pure(new F()));

    // plain
    t.true(type.isObject.plain({}));
    t.true(type.isObject.plain(o));
    t.true(type.isObject.plain(Object()));
    t.true(type.isObject.plain(new Object()));

    t.false(type.isObject.plain(Object(1)));
    t.false(type.isObject.plain(new Object('')));
    t.false(type.isObject.plain(new F()));
    t.false(type.isObject.plain(new Date()));
    t.false(type.isObject.plain([]));
    t.false(type.isObject.plain(1));
    t.false(type.isObject.plain(null));
    t.false(type.isObject.plain());

    // primitives
    t.true(type.isPrimitive(undefined));
    t.true(type.isPrimitive(null));
    t.true(type.isPrimitive(true));
    t.true(type.isPrimitive(1));
    t.true(type.isPrimitive('test'));
    t.true(type.isPrimitive(Boolean()));
    t.true(type.isPrimitive(Number()));
    t.true(type.isPrimitive(String()));

    t.false(type.isPrimitive({}));
    t.false(type.isPrimitive([]));
    t.false(type.isPrimitive(Object(undefined)));
    t.false(type.isPrimitive(Object(null)));
    t.false(type.isPrimitive(Object(true)));
    t.false(type.isPrimitive(Object(1)));
    t.false(type.isPrimitive(Object('test')));
    t.false(type.isPrimitive(new Boolean()));
    t.false(type.isPrimitive(new Number()));
    t.false(type.isPrimitive(new String()));
    t.false(type.isPrimitive(new Date()));
    t.false(type.isPrimitive(new F()));

    // easy
    t.true(type.isEasy(null));
    t.true(type.isEasy(true));
    t.true(type.isEasy(false));
    t.true(type.isEasy(1));
    t.true(type.isEasy(''));
    t.true(type.isEasy('test'));

    t.false(type.isEasy({}));
    t.false(type.isEasy(Object()));
    t.false(type.isEasy([]));
    t.false(type.isEasy(new F()));
    t.false(type.isEasy(undefined));
    t.false(type.isEasy());
    t.false(type.isEasy(Symbol('test')));

    //array of ...
    t.true(type.isArray.ofNumbers([0, -1.5, NaN]));
    t.true(type.isArray.ofStrings(['', 'test']));
    t.true(type.isArray.ofBooleans([true, false]));
    t.true(type.isArray.ofFunctions([function(){}, () => {}, F]));
    t.true(type.isArray.ofObjects([{}, Object(), new Object(), o]));
    t.true(type.isArray.ofArrays([[], [1, 2, 3], Array(10)]));
    t.true(type.isArray.ofPrimitives([undefined, null, true, 1, '']));
    t.true(type.isArray.ofEasies([null, true, 1, '']));
    t.true(type.isArray.empty([]));

    t.false(type.isArray.ofEasies([undefined, [], {}]));

    // serializable
    t.true(type.isSerializable(null));
    t.true(type.isSerializable(true));
    t.true(type.isSerializable(1));
    t.true(type.isSerializable(''));
    t.true(type.isSerializable([]));
    t.true(type.isSerializable([null, true, 1, '']));

    t.false(type.isSerializable([undefined, [], {}]));
});
