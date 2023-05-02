const httpStatus = require('http-status');
const { SoudhaPartner, OilType } = require('../../models');
const { BookedConsignment } = require('../../models');
const ApiError = require('../../utils/ApiError');
const pick = require('../../utils/pick');

const createOilType = async req => {
  try {
    const oilType = await OilType.create(req.body);

    return oilType;
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(httpStatus.FOUND, 'Oil type already exists');
    } else {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Server error try again '
      );
    }
  }
};
const getAllOilType = async req => {
  const oilType = await OilType.find();

  return oilType;
};

module.exports = {
  createOilType,
  getAllOilType,
};
