const httpStatus = require('http-status');
const { userService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const downloadUsers = catchAsync(async (req, res) => {
  const users = userService.getAllUser();
  res.status(httpStatus.OK).send(users);
});

module.exports = {
  downloadUsers,
};
