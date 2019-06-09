# hard-prop

Easy way to create properties with getter and/or setter.

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

## Install

```bash
npm install hard-prop
```

## Usage

```js
var prop = require('hard-prop')(object);

prop(name, {get: getter, set: setter});
prop(name, {get: getter});
prop(name, {set: setter});
prop(name, getter, setter);
prop(name, setter, getter);
prop(name, getter);
prop(name, setter);
```

Creates function, that defines properties for given object.

First parameter `name` must be string.

Second parameter can be object with properties `get` and/or `set` for getter and/or setter. In other way one or more functions can be given as parameters. Function with no arguments will be getter, and function with arguments will be setter (only first argument counts).

If only getter given - property will be read-only (error will thrown on write). If only setter given - property will be write-only (error will thrown on read). At least one getter or setter must be given.

## Examples

Class way:

```js
const P = require('hard-prop');

function Human(firstname, lastname){
    const _p = P(this);
    const [_firstname, _lastname] = [firstname, lastname];
    _p('name',
        () => [_firstname, _lastname].join(' '),
        v => [_firstname, _lastname] = v.split(' ')
    );
}
```

Closure way:

```js
const P = require('hard-prop');

const Human(firstname, lastname) => {
    const _name = {firstname, lastname};
    const _p = P(_name);
    _p('name',
        () => [_name.firstname, _name.lastname].join(' '),
        v => [_firstname, _lastname] = v.split(' ')
    );
}
```


## License

MIT

[npm-url]: https://npmjs.org/package/hard-prop
[npm-image]: https://badge.fury.io/js/hard-prop.svg
[travis-url]: https://travis-ci.org/astur/hard-prop
[travis-image]: https://travis-ci.org/astur/hard-prop.svg?branch=master