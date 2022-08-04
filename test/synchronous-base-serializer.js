import { test } from 'tap';
import serializeError from '../exports/base.js';

test('synchronously importing the base serializer works', async (t) => {
  const baz = new Error('baz');
  const bar = new Error('bar', { cause: baz });
  const foo = new Error('foo', { cause: bar });

  const serialized = serializeError(foo);

  t.equal(serialized.message, 'foo');
  t.equal(serialized.cause.message, 'bar');
  t.equal(serialized.cause.cause.message, 'baz');
});
