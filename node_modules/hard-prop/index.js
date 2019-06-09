module.exports = object => (name, ...args) => {
    if(typeof name !== 'string') throw new Error('name must be a string');
    if(args.length === 0) throw new Error('need getter or setter function');

    const ad = {
        get(){ throw new Error(`unable to get property: ${name}`); },
        set(v){ throw new Error(`unable to set property: ${name}`); },
    };

    if(typeof args[0] === 'object'){
        if(args.length > 1) throw new Error('too many arguments');
        ad.get = args[0].get || ad.get;
        ad.set = args[0].set || ad.set;
    } else {
        args.forEach(f => {
            if(typeof f !== 'function') throw new Error('bad argument');
            ad[f.length === 0 ? 'get' : 'set'] = f;
        });
    }

    Object.defineProperty(object, name, ad);
};
