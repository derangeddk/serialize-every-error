const seen = Symbol('base-serializer__circular-ref-seen');

const { toString, hasOwnProperty } = Object.prototype;

export default (err, serializeError) => {
  // This array check covers the case where e.g. AggregateError has
  // a list of causing errors in `.errors`. This key will be serialized,
  // which hits this case, and then each element is serialized.
  if(Array.isArray(err)) {
    return err.map(serializeError);
  }

  // This early-outs for primitive types that need to serialization
  if(typeof err !== 'object') {
    return err;
  }

  // Mark if we have seen an object before, and avoid re-serializing circular references.
  err[seen] = undefined;

  const serialized = {
    type: toString.call(err.constructor) === '[object Function]' ? err.constructor.name : err.name,
  };

  for (const key of Object.getOwnPropertyNames(err)) {
    if (serialized[key] !== undefined) {
      continue;
    }

    const value = err[key];
    if(hasOwnProperty.call(value, seen)) {
      continue;
    }

    serialized[key] = serializeError(err[key]);
  }

  // Clean up circular reference check
  delete err[seen];

  return serialized;
};

export const canHandle = () => true;
