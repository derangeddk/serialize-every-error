import loadSerializers from './loadSerializers.js';

export default async (options) => {
  const serializers = await loadSerializers(options);

  return function serializeError(err) {
    const serializer = serializers.find((s) => s.canHandle(err));
    return serializer.default(err, serializeError);
  };
};
