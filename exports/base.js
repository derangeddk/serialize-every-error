import baseSerializer from '../baseSerializer.js';

const recursiveBaseSerializer = (err) => baseSerializer(err, recursiveBaseSerializer);
export default recursiveBaseSerializer;
