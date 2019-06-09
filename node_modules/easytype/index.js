const type = v => ({}).toString.call(v).slice(8, -1);

type.isUndefined = v => type(v) === 'Undefined';
type.isDefined = v => type(v) !== 'Undefined';
type.isNull = v => type(v) === 'Null';
type.isString = v => type(v) === 'String';
type.isBoolean = v => type(v) === 'Boolean';
type.isNumber = v => type(v) === 'Number';
type.isArray = v => type(v) === 'Array';
type.isObject = v => type(v) === 'Object';
type.isFunction = v => type(v) === 'Function';
type.isRegExp = v => type(v) === 'RegExp';
type.isDate = v => type(v) === 'Date';
type.isSet = v => type(v) === 'Set';
type.isMap = v => type(v) === 'Map';
type.isWeakSet = v => type(v) === 'WeakSet';
type.isWeakMap = v => type(v) === 'WeakMap';
type.isSymbol = v => type(v) === 'Symbol';
type.isError = v => type(v) === 'Error';
type.isPromise = v => type(v) === 'Promise';

type.isNumber.finite = v => Number.isFinite(v);

type.isNaN = v => v !== v;

type.isObject.pure = v => type.isObject(v) && Reflect.getPrototypeOf(v) === null;
type.isObject.plain = v => type.isObject(v) && [null, Reflect.getPrototypeOf({})].includes(Reflect.getPrototypeOf(v));
type.isPrimitive = v => v !== Object(v);
type.isEasy = v => ['Boolean', 'Null', 'Number', 'String'].includes(type(v));

type.isArray.ofNumbers = v => type.isArray(v) && v.every(e => type.isNumber(e));
type.isArray.ofStrings = v => type.isArray(v) && v.every(e => type.isString(e));
type.isArray.ofBooleans = v => type.isArray(v) && v.every(e => type.isBoolean(e));
type.isArray.ofFunctions = v => type.isArray(v) && v.every(e => type.isFunction(e));
type.isArray.ofObjects = v => type.isArray(v) && v.every(e => type.isObject(e));
type.isArray.ofArrays = v => type.isArray(v) && v.every(e => type.isArray(e));
type.isArray.ofPrimitives = v => type.isArray(v) && v.every(e => type.isPrimitive(e));
type.isArray.ofEasies = v => type.isArray(v) && v.every(e => type.isEasy(e));
type.isArray.empty = v => type.isArray(v) && v.length === 0;

type.isSerializable = v => type.isEasy(v) || type.isArray.ofEasies(v);

module.exports = type;
