const mongoose = require('mongoose');
const { toJSON } = require('../plugins');
const paginate = require('../plugins/paginate.plugin');

const BookedConsignmentSchema = mongoose.Schema(
  {
    bookingDate: {
      type: Date,
      required: true,
    },
    oilType: {
      type: String,
      required: true,
    },
    bookedQuantity: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    advancePayment: {
      type: Number,
    },
    partnerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'SoudhaPartner',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
BookedConsignmentSchema.plugin(toJSON);
BookedConsignmentSchema.plugin(paginate);

/**
 * @typedef soudhaPartner
 */
const BookedConsignment = mongoose.model(
  'BookedConsignments',
  BookedConsignmentSchema
);

module.exports = BookedConsignment;
