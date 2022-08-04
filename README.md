Serialize every error!
======================

This package strives to be an exhaustive alternative to normal error serialization for logging, plugging into [bunyan](https://npmjs.com/package/bunyan) and [pino](https://npmjs.com/package/pino).

The goal is to serialize all the information on your errors, so you are less likely to log useless information, and having to change your code to log different information, on and on until you get something useful in your logs.

That is, the design goal is *exhaustiveness over performance* --- besides, the performance impact will be minimal.

On top of this, every error serializer in this collection will be exposed individually, and you can configure the whole package at import time to only include the serializers you want. A reasonable base serializer handles most common cases anyway.

Tradeoffs
---------

Should you use this library? That depends on what you want.

The [pino standard error serializer](https://www.npmjs.com/package/pino-std-serializers#user-content-exportserrerror) optimizes for value per size of log statements, which means that standard errors will be well-supported, and provide relatively dense information.

We take a different approach: we would like everything on an error that might be significant to be serialized. That necessarily results in larger logging objects. Even if what is thrown in your code isn't technically an [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error).

We have an eager base serializer that includes all information, but add specialized serializers for common error types<!-- (for example, [VError](./serializers/verror.js), [axios](./serializers/axios.js))-->, which handle special cases where we might want to modify behavior.

For example, VError-type errors evaluate a chain of `cause()` functions that point to sub-errors. This requires some custom implementation.

Usage
-----

The error serializer can be added to, for example, pino to add exhaustive error serialization. When you call `req.log.error` with an object with the key `err` that will be serialized as an error.

Here is an example of adding serialize-every-error to an express app using pino as the logger:

```js
import express from 'express';
import createErrorSerializer from 'serialize-every-error';
import pino from 'pino-http';

const app = express();

app.use(pino({
    serializers: {
        // Register the standard serializers for other cases,
        // because `wrapSerializers` has been disabled
        ...pino.stdSerializers,

        // Run the error serializer constructor, and register it for
        // the `err` key, overwriting the default serializer.
        err: await createErrorSerializer(),
    },

    // Disable default serializer altogether
    wrapSerializers: false,
}));

// Now the logger can be used:
app.get('/', (req, res) => {
    // Set up an error with a .cause and a field .hello that should be serialized
    const cause = new Error("A cause for this error");
    const err = new Error("An error occurred", { cause });
    err.hello = "world";

    // Note: the field `err` is a significant key that triggers the error serializer,
    // c.f. https://github.com/pinojs/pino/blob/master/docs/api.md#errors
    req.log.error({ err }, "An error occurred");

    res.status(500).send({ err });
});
```

Alternatively, with bunyan, it looks like this:

```js
import bunyan from 'bunyan';

app.use((req, res, next) => {
    req.log = bunyan.createLogger({
        serializers: {
            err: await createErrorSerializer(),
        },
    });
});
```

Notice that in both cases the special key `err` is what you need to put errors in to have them serialized using this serializer.

### Synchronous loading

If you do not want to use the asynchronous constructor (`createErrorSerializer`) you can instead choose to import just the base serializer using the `serialize-every-error/base` export. 

The base serializer only includes a simple serializer that works for *most errors* but without the added nice error serialization for certain errors.

The base serializer can be plugged in to e.g. pino in an express app like this (see context above):

```js
import serializeError from 'serialize-every-error/base';

app.use(pino({
    serializers: {
        ...pino.stdSerializers,
        err: serializeError,
    },
    wrapSerializers: false,
}));
```

Reference
---------

### `createErrorSerializer([options])`

The default export from the package, sets up a serializer.

- `options`, an object that modifies the behavior of the serializer created.
  - `include`: an array of strings designating which specialized serializers should be enabled. When this option is present, only the base serializer is included if not otherwise specified. See [supported serializers](#Supported-serializers) below.  
    This field can only be set if `exclude` is *not* set (they are mutually exclusive).  
    Default behavior: include all serializers.
  - `exclude`: an array of strings designating which specialized serializers should be disabled. When present, all serializers are included, unless specified in the array. See [supported serializers](#Supported-serializers) below.  
    This field can only be set if `include` is *not* set (they are mutually exclusive).  
    Default behavior: include all serializers.
- Returns: `Promise<ErrorSerializer>`, await the `Promise` to get the `ErrorSerializer` which serializes errors exhaustively.

### `ErrorSerializer`

A function `(error: any) => any` that takes some value to be serialized as an error, and returns a serialized version of the input, where everything is plain and JSON stringifyable values.

### Supported serializers

There are no currently supported serializers. Help by [contributing](#contributing).

Contributing
------------

We would love your contributions: fixes to serializers and new serializers altogether. Here are some hints to contributing:

- Start with a failing test to show what you are covering
- Ask if you are uncertain: does it make more sense to contribute a new serializer or change an existing one
- Write code in the style of the rest of the code base
- Open a PR with your code, even if it isn't completely finished, and ask any questions you may have

### Adding a new serializer

Documentation on the way...
