// const stripeSecretKey = require('../config/keys').stripeSecretKey;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/Tour');

exports.getCheckoutSession = async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // const YOUR_DOMAIN = 'http://localhost:3000/';

  // console.log('req: ', req);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,
    // success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
    // cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    success_url: `${req.protocol}://${req.get('host')}/booking-processed`,
    cancel_url: `${req.protocol}://${req.get('host')}/package-detail/${req.params.tourId}`,

    // success_url: `${YOUR_DOMAIN}booking-processed`,
    // cancel_url: `${YOUR_DOMAIN}package-detail/${req.params.tourId}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: 'payment',

    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name}`,
            description: tour.summary,
            images: [
              'https://firebasestorage.googleapis.com/v0/b/gonature-a4df6.appspot.com/o/images%2Fwellness_7.jpg?alt=media&token=d83509dc-eae9-45ea-8ead-4e5936f54ff7',
            ],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],

    // metadata: {
    //   name: `${tour.name} Tour`,
    //   description: tour.summary,
    //   // images: [
    //   // `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
    //   // ],
    // },
  });


  // 3) Create session as response
  res.status(200).json(session);
};
