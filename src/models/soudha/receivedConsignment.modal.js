const mongoose = require('mongoose');
const { toJSON } = require('../plugins');
const paginate = require('../plugins/paginate.plugin');

const ReceivedConsignmentSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    billNo: {
      type: String,
      required: true,
    },
    billingQuantity: {
      type: Number,
      required: true,
    },
    billingRate: {
      type: Number,
      required: true,
    },
    totalBillingAmount: {
      type: Number,
      required: true,
    },
    vehicleNo: {
      type: String,
      required: true,
    },
    unloadQuantity: {
      type: Number,
      required: true,
    },
    shortQuantity: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      required: true,
    },
    difference: {
      type: Number,
    },
    pendingConsignment: {
      type: Number,
    },
    payment: {
      type: Number,
    },
    otherAmount: {
      type: Number,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    bookedConsignmentId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'SoudhaPartner',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
ReceivedConsignmentSchema.plugin(toJSON);
ReceivedConsignmentSchema.plugin(paginate);

/**
 * @typedef soudhaPartner
 */

const ReceivedConsignment = mongoose.model(
  'ReceivedConsignments',
  ReceivedConsignmentSchema
);

module.exports = ReceivedConsignment;
