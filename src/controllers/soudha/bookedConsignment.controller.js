const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const {
  bookedConsignmentService,
  soudhaPartnerService,
} = require('../../services');

const addBookedConsignment = catchAsync(async (req, res) => {
  const consignment = await bookedConsignmentService.createConsignment(
    req.body
  );
  res.status(httpStatus.CREATED).send({ consignment });
});

const getConsignmentsByPartner = catchAsync(async (req, res) => {
  const bookedConsignment =
    await bookedConsignmentService.getConsignmentOfPartner(req);
  const partnerId = req.params.partnerId;

  const totalInfo = await bookedConsignmentService.getConsignmentTotalInfo(
    partnerId
  );

  const partner = await soudhaPartnerService.getPartner(req.params.partnerId);
  res
    .status(httpStatus.CREATED)
    .send({
      consignments: bookedConsignment,
      partner,
      totalInfo: totalInfo[0],
    });
});

const updateConsignmentsByPartner = catchAsync(async (req, res) => {
  const consignments =
    await bookedConsignmentService.updateConsignmentOfPartner(req);
  res.status(httpStatus.OK).send({ consignments });
});

const deleteConsignmentsByPartner = catchAsync(async (req, res) => {
  const consignments =
    await bookedConsignmentService.deleteConsignmentOfPartner(
      req.params.partnerId
    );

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  addBookedConsignment,
  getConsignmentsByPartner,
  deleteConsignmentsByPartner,
  updateConsignmentsByPartner,
};
