import { test } from 'tap';
import createSerializer from '../index.js';

test('serializes nested causes with just the base serializer', async (t) => {
  const baz = new Error('baz');
  const bar = new Error('bar', { cause: baz });
  const foo = new Error('foo', { cause: bar });

  const serializeError = await createSerializer({ include: [] });
  const serialized = serializeError(foo);

  t.equal(serialized.message, 'foo');
  t.equal(serialized.cause.message, 'bar');
  t.equal(serialized.cause.cause.message, 'baz');
});

test('serializes custom keys added to errors with just the base serializer', async (t) => {
  const foo = new Error('foo');
  foo.statistics = 2;

  const serializeError = await createSerializer({ include: [] });
  const serialized = serializeError(foo);

  t.equal(serialized.statistics, 2);
});

[ undefined, null ].forEach((value) => {
  test(`serializes ${value} fields out of existence`, async (t) => {
    const foo = {'foo': value};

    const serializeError = await createSerializer({ include: [] });
    const serialized = serializeError(foo);

    t.ok(serialized);
    t.equal(serialized.foo, undefined);
  });
});

test('serializes falsy 0 value correctly', async (t) => {
  const foo = {'foo': 0};

  const serializeError = await createSerializer({ include: [] });
  const serialized = serializeError(foo);

  t.ok(serialized);
  t.equal(serialized.foo, 0);
});

test('serializes falsy empty string value correctly', async (t) => {
  const foo = {'foo': 0};

  const serializeError = await createSerializer({ include: [] });
  const serialized = serializeError(foo);

  t.ok(serialized);
  t.same(serialized.foo, '');
});
