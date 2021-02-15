const express = require('express');
const passport2 = require('../../config/passport2');
const bookingController= require('../../controllers/bookingController')

const router = express.Router();

// @route /api/v1/bookings/create-checkout-session/:tourID
// @desc check out the session during booking payment process
// @access Private

router.get(
  '/create-checkout-session/:tourId',
  passport2.protect, bookingController.getCheckoutSession
);



module.exports = router;
