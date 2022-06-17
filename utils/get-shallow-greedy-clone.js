export default (obj, filter) => {
  const shallowClone = {};

  for (const key of Object.getOwnPropertyNames(obj)) {
    if(!filter(key, obj[key])) {
      continue;
    }
    shallowClone[key] = err[key];
  }

  return shallowClone;
};
