const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { name, password } = req.body;
  // const user = await authService.loginUserWithEmailAndPassword(email, password);
  await authService.loginUserWithNameAndPassword(name, password);
  const user = await authService.assignOtp(name);

  // const tokens = await tokenService.generateAuthTokens(user);

  res.send({ user });
});

const verifyOtp = catchAsync(async (req, res) => {
  const { otp, name } = req.body;

  const user = await authService.validateOtp(otp, name);

  const tokens = await tokenService.generateAuthTokens(user);

  await authService.clearOtp(user.name);

  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const user = await authService.assignOtp(req.body.name, true);

  // const resetPasswordToken = await tokenService.generateResetPasswordToken(
  //   req.body.email
  // );
  // await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.OK).send(user);
});
const resendOtp = catchAsync(async (req, res) => {
  const user = await authService.assignOtp(req.body.name);

  // const resetPasswordToken = await tokenService.generateResetPasswordToken(
  //   req.body.email
  // );
  // await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.OK).send(user);
});

const verifyForgotPasswordOtp = catchAsync(async (req, res) => {
  const { otp, name } = req.body;

  const user = await authService.validateOtp(otp, name);

  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    name,
    'isForgotPassword'
  );

  await authService.clearOtp(user.name);

  res.send({ user, resetPasswordToken });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  // await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  verifyOtp,
  verifyForgotPasswordOtp,
  resendOtp,
};
