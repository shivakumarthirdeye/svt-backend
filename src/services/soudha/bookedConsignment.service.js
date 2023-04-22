const { SoudhaPartner } = require('../../models');
const { BookedConsignment } = require('../../models');
const pick = require('../../utils/pick');

const createConsignment = async partnerBody => {
  const bookedConsignment = await BookedConsignment.create(partnerBody);

  await SoudhaPartner.findByIdAndUpdate(partnerBody.partnerId, {
    $push: { consignments: bookedConsignment.id },
  });

  return bookedConsignment;
};

const getConsignmentOfPartner = async req => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const filter = {
    partnerId: req.params.partnerId,
  };
  const bookedConsignment = await BookedConsignment.paginate(filter, options);
  if (!bookedConsignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Consignment not found');
  }
  return bookedConsignment;
};

module.exports = {
  createConsignment,
  getConsignmentOfPartner,
};
