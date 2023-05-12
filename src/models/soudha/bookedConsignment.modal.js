const mongoose = require('mongoose');
const { toJSON } = require('../plugins');
const paginate = require('../plugins/paginate.plugin');
const { bookedConsignmentStatus } = require('../../config/constant');

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
    averageRate: {
      type: Number,
    },
    pendingConsignment: {
      type: Number,
    },

    advancePayment: {
      type: Number,
    },
    gst: {
      type: Number,
    },
    partnerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'SoudhaPartner',
    },
    status: {
      type: String,
      enum: [
        bookedConsignmentStatus.PENDING,
        bookedConsignmentStatus.COMPLETED,
      ],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    receivedConsignments: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'ReceivedConsignments',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
BookedConsignmentSchema.plugin(toJSON);
BookedConsignmentSchema.plugin(paginate);

BookedConsignmentSchema.pre('save', function (next) {
  const bookedConsignment = this;

  if (bookedConsignment.rate && bookedConsignment.bookedQuantity) {
    bookedConsignment.averageRate =
      bookedConsignment.bookedQuantity * bookedConsignment.rate;
  }
  next();
});
BookedConsignmentSchema.pre('updateOne', function (next) {
  const bookedConsignment = this.getUpdate();

  if (bookedConsignment.rate && bookedConsignment.bookedQuantity) {
    bookedConsignment.averageRate =
      bookedConsignment.bookedQuantity * bookedConsignment.rate;
  }

  next();
});
const BookedConsignment = mongoose.model(
  'BookedConsignments',
  BookedConsignmentSchema
);

module.exports = BookedConsignment;
