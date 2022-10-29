const _ = require('lodash');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
exports.pick = _.pick;
exports.find = _.find;
exports.keyBy = _.keyBy;
exports.hash = async (v) => {
  if (!v) return v;
  const hash = await bcrypt.hash(v, 10);
  return hash;
};
module.exports.isObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};