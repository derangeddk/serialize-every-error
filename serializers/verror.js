import getShallowGreedyClone from '../utils/get-shallow-greedy-clone.js';

export default (err, serializeError) => {
  const cause = err.cause.bind(err);
  const shallowClone = getShallowGreedyClone(err, (key) => key != 'cause');

  const serialized = serializeError(shallowClone);
  serialized.cause = cause();

  return serialized;
};

export const canHandle = (err) => err.cause && typeof err.cause === 'function';
