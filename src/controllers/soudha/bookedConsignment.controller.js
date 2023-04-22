const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { bookedConsignmentService } = require('../../services');

const addBookedConsignment = catchAsync(async (req, res) => {
  const consignment = await bookedConsignmentService.createConsignment(
    req.body
  );
  res.status(httpStatus.CREATED).send({ consignment });
});

const getConsignmentsByPartner = catchAsync(async (req, res) => {
  const partner = await bookedConsignmentService.getConsignmentOfPartner(req);
  res.status(httpStatus.CREATED).send({ partner });
});

module.exports = { addBookedConsignment, getConsignmentsByPartner };
