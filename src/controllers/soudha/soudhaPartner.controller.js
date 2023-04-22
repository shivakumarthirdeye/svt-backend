const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { soudhaPartnerService } = require('../../services');

const addSoudhaPartner = catchAsync(async (req, res) => {
  const partner = await soudhaPartnerService.createPartner(req.body);
  res.status(httpStatus.CREATED).send({ partner });
});

const getAllPartners = catchAsync(async (req, res) => {
  const partners = await soudhaPartnerService.getPartners(req);
  res.status(httpStatus.OK).send({ partners });
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

  const partners = await soudhaPartnerService.deletePartner(id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  addSoudhaPartner,
  getAllPartners,
  deletePartner,
  updateSoudhaPartner,
  getPartner,
};
