const mongoose = require('mongoose');
const { toJSON } = require('../plugins');
const {
  soudhaPartnerStatus,
  bookedConsignmentStatus,
} = require('../../config/constant');
const paginate = require('../plugins/paginate.plugin');

const SoudhaPartnerSchema = mongoose.Schema(
  {
    tableId: {
      type: String,
      unique: true,
    },
    partnerName: {
      type: String,
      required: true,
      index: true,
    },
    location: {
      type: String,
      required: true,
    },
    whatsappNo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [soudhaPartnerStatus.ACTIVE, soudhaPartnerStatus.INACTIVE],
      required: true,
    },
    soudhaStatus: {
      type: String,
      enum: [
        bookedConsignmentStatus.PENDING,
        bookedConsignmentStatus.COMPLETED,
      ],
      required: true,
      default: bookedConsignmentStatus.PENDING,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    consignments: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'BookedConsignments',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
SoudhaPartnerSchema.plugin(toJSON);
SoudhaPartnerSchema.plugin(paginate);

/**
 * @typedef soudhaPartner
 */
const SoudhaPartner = mongoose.model('SoudhaPartner', SoudhaPartnerSchema);

module.exports = SoudhaPartner;
