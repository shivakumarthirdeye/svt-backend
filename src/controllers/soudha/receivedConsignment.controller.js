const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const {
  receivedConsignmentService,
  bookedConsignmentService,
} = require('../../services');

const addReceivedConsignment = catchAsync(async (req, res) => {
  const consignment =
    await receivedConsignmentService.createReceivedConsignment(req.body);
  res.status(httpStatus.CREATED).send({ consignment });
});

const getReceivedConsignmentByBooked = catchAsync(async (req, res) => {
  const receivedConsignments =
    await receivedConsignmentService.getReceivedConsignmentsByBooked(req);
  const bookedConsignmentId = req.params.bookedConsignmentId;

  const bookedConsignment = await bookedConsignmentService.getConsignment(
    bookedConsignmentId
  );
  const totalInfo =
    await receivedConsignmentService.getReceivedConsignmentTotalInfo(
      bookedConsignmentId
    );

  res.status(httpStatus.OK).send({
    receivedConsignments,
    bookedConsignment,

    totalInfo: totalInfo[0],
  });
});

// const updateConsignmentsByPartner = catchAsync(async (req, res) => {
//   const consignments =
//     await bookedConsignmentService.updateConsignmentOfPartner(req);
//   res.status(httpStatus.OK).send({ consignments });
// });

const deleteReceivedConsignment = catchAsync(async (req, res) => {
  await receivedConsignmentService.deleteReceivedConsignment(
    req.params.receivedConsignmentId
  );

  res.status(httpStatus.NO_CONTENT).send();
});
const updateReceivedConsignment = catchAsync(async (req, res) => {
  await receivedConsignmentService.updateReceivedConsignment(req);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  addReceivedConsignment,
  getReceivedConsignmentByBooked,
  deleteReceivedConsignment,
  updateReceivedConsignment,
};
