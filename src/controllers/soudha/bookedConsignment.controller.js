const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const {
  bookedConsignmentService,
  soudhaPartnerService,
  receivedConsignmentService,
} = require('../../services');

const addBookedConsignment = catchAsync(async (req, res) => {
  const consignment = await bookedConsignmentService.createConsignment(req);
  res.status(httpStatus.CREATED).send({ consignment });
});

const getConsignmentsByPartner = catchAsync(async (req, res) => {
  const bookedConsignments =
    await bookedConsignmentService.getConsignmentOfPartner(req);
  const partnerId = req.params.partnerId;

  const totalInfo = await bookedConsignmentService.getConsignmentTotalInfo(
    partnerId
  );

  const receivedConsignTotalInfo = await Promise.all(
    bookedConsignments.results.map(async element => {
      const totalInfo =
        await receivedConsignmentService.getReceivedConsignmentTotalInfo(
          element._id
        );
      return { id: element._id, totalInfo: totalInfo[0] };
    })
  );

  const partner = await soudhaPartnerService.getPartner(req.params.partnerId);

  res.status(httpStatus.CREATED).send({
    consignments: bookedConsignments,
    partner,
    totalInfo: totalInfo[0],
    receivedConsignTotalInfo,
  });
});
const getConsignment = catchAsync(async (req, res) => {
  const bookedConsignment = await bookedConsignmentService.getConsignment(
    req.query.consignmentId
  );
  res.status(httpStatus.CREATED).send({
    bookedConsignment,
  });
});

const getAllPendingConsignments = catchAsync(async (req, res) => {
  const pendingConsignments =
    await bookedConsignmentService.getPendingConsignment(req);

  const receivedConsignTotalInfo = await Promise.all(
    pendingConsignments.results.map(async element => {
      const totalInfo =
        await receivedConsignmentService.getReceivedConsignmentTotalInfo(
          element._id
        );

      return { id: element._id, totalInfo: totalInfo[0] };
    })
  );
  res
    .status(httpStatus.OK)
    .send({ pendingConsignments, receivedConsignTotalInfo });
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
  getConsignment,
  getAllPendingConsignments,
};
