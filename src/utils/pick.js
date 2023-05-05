/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (
      object &&
      Object.prototype.hasOwnProperty.call(object, key) &&
      object[key] &&
      object[key] !== 'undefined' &&
      object[key] !== 'null' &&
      object[key] !== null
    ) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

module.exports = pick;
