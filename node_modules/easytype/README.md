# easytype

Just something better then `typeof`

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

## Install

```bash
npm i easytype
```

## Usage

```js
const type = require('easytype');

type()                           //'Undefined'
type(undefined)                  //'Undefined'
type(void 0)                     //'Undefined'

type(null)                       //'Null'

type('')                         //'String'
type('🦄')                       //'String'

type(true)                       //'Boolean'
type(false)                      //'Boolean'
type(type(Boolean())             //'Boolean'
type(type(Boolean(1))            //'Boolean'
type(type(new Boolean())         //'Boolean'

type(0)                          //'Number'
type(-1.5)                       //'Number'
type(NaN)                        //'Number'
type(Infinity)                   //'Number'
type(Number())                   //'Number'
type(Number(-1.5))               //'Number'
type(Number('-1.5'))             //'Number'
type(Number(true))               //'Number'
type(Number('1string'))          //'Number'
type(Number('string'))           //'Number'
type(new Number())               //'Number'

type(Symbol('test'))             //'Symbol'
type(Symbol())                   //'Symbol'

type({})                         //'Object'
type(Object())                   //'Object'
type(new Object())               //'Object'
type(Object.create(null))        //'Object'

type(Math)                       //'Math'
type(JSON)                       //'JSON'

type([])                         //'Array'
type(Array())                    //'Array'
type(new Array())                //'Array'
type(Array.from('123'))          //'Array'

type(() => {})                   //'Function'
type(function(){})               //'Function'
type(Object)                     //'Function'
type(new Function())             //'Function'
type(new Function('return 0;'))  //'Function'

type(/^.*$/)                     //'RegExp'
type(new RegExp('^.*$'))         //'RegExp'
type(new RegExp('ab+c', 'ig'))   //'RegExp'

type(new Date())                 //'Date'
type(new Date(0))                //'Date'

type(new Set())                  //'Set'
type(new Map())                  //'Map'
type(new WeakSet())              //'WeakSet'
type(new WeakMap())              //'WeakMap'

type(new Error())                //'Error'
type(new EvalError())            //'Error'
type(new RangeError())           //'Error'
type(new ReferenceError())       //'Error'
type(new SyntaxError())          //'Error'
type(new TypeError())            //'Error'
type(new URIError())             //'Error'

type(new Int8Array())            //'Int8Array'
type(new Uint8Array())           //'Uint8Array'
type(new Uint8ClampedArray())    //'Uint8ClampedArray'
type(new Int16Array())           //'Int16Array'
type(new Uint16Array())          //'Uint16Array'
type(new Int32Array())           //'Int32Array'
type(new Uint32Array())          //'Uint32Array'
type(new Float32Array())         //'Float32Array'
type(new Float64Array())         //'Float64Array'

type(new Promise(() => {}))      //'Promise'
type((Promise.resolve(1))        //'Promise'

// Shortcuts: //

// returns true:
type.isUndefined()
type.isDefined('test')
type.isNull(null)
type.isString('')
type.isBoolean(true)
type.isNumber(1)
type.isArray([])
type.isObject({})
type.isFunction(() => {})
type.isRegExp(/^.*$/)
type.isDate(new Date())
type.isSet(new Set())
type.isMap(new Map())
type.isWeakSet(new WeakSet())
type.isWeakMap(new WeakMap())
type.isSymbol(Symbol('test'))
type.isError(new Error())
type.isPromise(new Promise(() => {}))

// returns false:
type.isUndefined('test')
type.isDefined()
type.isNull('null')
type.isString(true)
type.isBoolean('true')
type.isNumber('1')
type.isArray({length: 1})
type.isObject(null)
type.isFunction(global)
type.isRegExp('/^.*$/')
type.isDate('Sat Dec 23 2017 18:44:45 GMT+0300 (MSK)')
type.isSet(new WeakSet())
type.isMap(new WeakMap())
type.isWeakSet(new Set())
type.isWeakMap(new Map())
type.isSymbol([Symbol('test')])
type.isError(Error)
type.isPromise(Promise.all)

// Advanced:

type.isNumber.finite(0)            //true
type.isNumber.finite(2e64)         //true
type.isNumber.finite(-1.5)         //true
type.isNumber.finite(NaN)          //false
type.isNumber.finite(Infinity)     //false
type.isNumber.finite(-Infinity)    //false

type.isNaN(NaN)         //true
type.isNaN('NaN')       //false
type.isNaN(Infinity)    //false
type.isNaN()            //false
type.isNaN(0)           //false
type.isNaN(null)        //false
type.isNaN([NaN])       //false

// let's play with it:
const o = Object.create(null)
function F(){}

// pure object (null prototype)
type.isObject.pure(o)             //true

type.isObject.pure({})            //false
type.isObject.pure(Object())      //false
type.isObject.pure(new Object())  //false
type.isObject.pure(new F())       //false

// plain object (native Object prototype)
type.isObject.plain({})            //true
type.isObject.plain(o)             //true
type.isObject.plain(Object())      //true
type.isObject.plain(new Object())  //true

type.isObject.plain(Object(1))       //false
type.isObject.plain(new Object(''))  //false
type.isObject.plain(new F())         //false
type.isObject.plain(new Date())      //false
type.isObject.plain([])              //false
type.isObject.plain(1)               //false
type.isObject.plain(null)            //false
type.isObject.plain()                //false

// primitive (x !== Object(x))
type.isPrimitive(undefined)          //true
type.isPrimitive(null)               //true
type.isPrimitive(true)               //true
type.isPrimitive(1)                  //true
type.isPrimitive('test')             //true
type.isPrimitive(Boolean())          //true
type.isPrimitive(Number())           //true
type.isPrimitive(String())           //true

type.isPrimitive({})                 //false
type.isPrimitive([])                 //false
type.isPrimitive(Object(undefined))  //false
type.isPrimitive(Object(null))       //false
type.isPrimitive(Object(true))       //false
type.isPrimitive(Object(1))          //false
type.isPrimitive(Object('test'))     //false
type.isPrimitive(new Boolean())      //false
type.isPrimitive(new Number())       //false
type.isPrimitive(new String())       //false
type.isPrimitive(new Date())         //false
type.isPrimitive(new F())            //false

// easy ('Boolean', 'Null', 'Number' or 'String')
type.isEasy(null)    //true
type.isEasy(true)    //true
type.isEasy(false)   //true
type.isEasy(1)       //true
type.isEasy('')      //true
type.isEasy('test')  //true

type.isEasy({})              //false
type.isEasy(Object())        //false
type.isEasy([])              //false
type.isEasy(new F())         //false
type.isEasy(undefined)       //false
type.isEasy()                //false
type.isEasy(Symbol('test'))  //false

type.isArray.ofNumbers([0, -1.5, NaN])                     //true
type.isArray.ofStrings(['', 'test'])                       //true
type.isArray.ofBooleans([true, false])                     //true
type.isArray.ofFunctions([function(){}, () => {}, F])      //true
type.isArray.ofObjects([{}, Object(), new Object(), o])    //true
type.isArray.ofArrays([[], [1, 2, 3], Array(10)])          //true
type.isArray.ofPrimitives([undefined, null, true, 1, ''])  //true
type.isArray.ofEasies([null, true, 1, ''])                 //true
type.isArray.empty([])                                     //true

// easy or array of easies
type.isSerializable(null)                 //true
type.isSerializable(true)                 //true
type.isSerializable(1)                    //true
type.isSerializable('')                   //true
type.isSerializable([])                   //true
type.isSerializable([null, true, 1, ''])  //true

type.isSerializable([undefined, [], {}])  //false
```

## License

MIT

[npm-url]: https://npmjs.org/package/easytype
[npm-image]: https://badge.fury.io/js/easytype.svg
[travis-url]: https://travis-ci.org/astur/easytype
[travis-image]: https://travis-ci.org/astur/easytype.svg?branch=master