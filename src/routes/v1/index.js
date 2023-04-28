const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const soudhaPartnerRoute = require('./soudha/soudhaPartner.route');
const bookedConsignmentRoute = require('./soudha/bookedConsignment.route');
const receivedConsignment = require('./soudha/receivedConsignment.route');
const downloadRoute = require('./download.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/soudha',
    route: soudhaPartnerRoute,
  },
  {
    path: '/soudha',
    route: bookedConsignmentRoute,
  },
  {
    path: '/soudha',
    route: receivedConsignment,
  },
  {
    path: '/downloads',
    route: downloadRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach(route => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
