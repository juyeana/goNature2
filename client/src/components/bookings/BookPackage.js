import axios from 'axios';
import React, { Component } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import keys from './keys';

const stripePromise = loadStripe(keys.STRIPE_CLIENT_KEY);

class BookPackage extends Component {
  getSession = async (id) => {
    const stripe = await stripePromise;
    const session = await axios.get(
      `/api/v1/bookings/create-checkout-session/${id}`
    );
    // console.log(session.data.id)

    await stripe.redirectToCheckout({ sessionId: session.data.id });
  };
  render() {
    this.getSession(this.props.match.params.id);
    return (
      <div class='u-margin-top-big u-margin-bottom-big'>
        <div class='heading-tertiary'>Booking process...</div>
      </div>
    );
  }
}

export default BookPackage;

// export default BookPackage = async (id) => {
//   try {
//     const stripe = await stripePromise;
//     const session = await axios.get(
//       `/api/v1/bookings/create-checkout-session/${id}`
//     );
//       console.log(session)
//     // await stripe.redirectToCheckout({
//     //   sessionId: data.sessionId,
//     // });
//   } catch (err) {
//     console.log(err);
//   }

// };
