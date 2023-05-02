const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { oilTypeService } = require('../../services');

const addOilType = catchAsync(async (req, res) => {
  const oilType = await oilTypeService.createOilType(req);
  res.status(httpStatus.CREATED).send({ oilType });
});

const getOilTypes = catchAsync(async (req, res) => {
  const oilTypes = await oilTypeService.getAllOilType(req);
  res.status(httpStatus.OK).send({ oilTypes });
});

module.exports = {
  addOilType,
  getOilTypes,
};
