export default async (options) => {
  options = options || {};
  const baseSerializer = options.baseSerializer || await import('./baseSerializer.js');

  //TODO: validate baseSerializer

  return [
    ...await loadSerializers(options),
    baseSerializer,
  ];
};

const loadSerializers = async (options) => {
  if(options.include && options.exclude) {
    throw new Error('You cannot both include and exclude serializers -- if you include you only get what is included; if you exclude the default is *every serializer* and you remove some');
  }

  const loaders = pickSerializerLoaders(options);

  return await Promise.all(loaders.map((loader) => loader.load()));
};

const pickSerializerLoaders = (options) => {
  if(options.include === null || isEmptyArray(options.include)) {
    return [];
  }

  if(options.include) {
    // TODO: validate include is a list
    return everySerializerLoader.filter((loader) => options.include.includes(loader.name));
  }

  // TODO: validate options.exclude if truthy
  const excludeList = options.exclude || [];
  return everySerializerLoader.filter((loader) => !excludeList.includes(loader.name));
};

const isEmptyArray = (arr) => Array.isArray(arr) && arr.length === 0;

const createLoader = (name) => {
  return {
    name,
    load: async () => import(`./serializers/${name}.js`),
  };
};

const everySerializerLoader = [
  'axios',
].map(createLoader);
