const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const {
  soudhaPartnerService,
  bookedConsignmentService,
  receivedConsignmentService,
} = require('../../services');

const addSoudhaPartner = catchAsync(async (req, res) => {
  const partner = await soudhaPartnerService.createPartner(req);
  res.status(httpStatus.CREATED).send({ partner });
});

const getAllPartners = catchAsync(async (req, res) => {
  const partners = await soudhaPartnerService.getPartners(req);
  const totalInfo = await Promise.all(
    partners.results.map(async element => {
      const totalInfo = await bookedConsignmentService.getConsignmentTotalInfo(
        element._id
      );
      return { id: element._id, totalInfo: totalInfo[0] };
    })
  );

  res.status(httpStatus.OK).send({ partners, totalInfo });
});

const getPendingPartners = catchAsync(async (req, res) => {
  const pendingPartners = await soudhaPartnerService.getPendingSoudhaPartner(
    req
  );

  const totalInfo = await Promise.all(
    pendingPartners.results.map(async element => {
      const totalInfo = await bookedConsignmentService.getConsignmentTotalInfo(
        element._id,
        true
      );

      return { id: element._id, totalInfo: totalInfo[0] };
    })
  );

  const receivedConsignTotalInfo = await Promise.all(
    pendingPartners.results.map(async element => {
      return await Promise.all(
        element.consignments.map(async item => {
          const totalInfo =
            await receivedConsignmentService.getReceivedConsignmentTotalInfo(
              item._id
            );

          return { id: element._id, totalInfo: totalInfo[0] };
        })
      );
    })
  );

  res.status(httpStatus.OK).send({
    pendingPartners,
    totalInfo,
    receivedConsignTotalInfo: receivedConsignTotalInfo.flat(),
  });
});

const getPartner = catchAsync(async (req, res) => {
  const partnerId = req.params.partnerId;
  const partner = await soudhaPartnerService.getPartner(partnerId);

  res.status(httpStatus.OK).send({ partner });
});

const updateSoudhaPartner = catchAsync(async (req, res) => {
  const partner = await soudhaPartnerService.updatePartner(req.body);
  res.status(httpStatus.OK).send({ partner });
});

const deletePartner = catchAsync(async (req, res) => {
  const id = req.params.partnerId;

  await soudhaPartnerService.deletePartner(id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  addSoudhaPartner,
  getAllPartners,
  deletePartner,
  updateSoudhaPartner,
  getPartner,
  getPendingPartners,
};
