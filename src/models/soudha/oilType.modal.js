const mongoose = require('mongoose');
const { toJSON } = require('../plugins');
const paginate = require('../plugins/paginate.plugin');

const OilTypeSchema = mongoose.Schema(
  {
    oilName: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
OilTypeSchema.plugin(toJSON);
OilTypeSchema.plugin(paginate);

/**
 * @typedef soudhaPartner
 */

const OilType = mongoose.model('OilTypes', OilTypeSchema);

module.exports = OilType;
