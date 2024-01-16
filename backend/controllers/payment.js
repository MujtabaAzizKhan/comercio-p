const User = require('../model/user');
const stripe = require('stripe')('');

// Need to add another call/command that places the shopping history/ purchase data into the database
// This will be done when we start our work on shopping history

exports.payment = async (req, res) => {
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2023-08-16'},
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount * 100, //Multiplied by 100 because it is in cents, we convert to dollars
    // amount: req.body.amount, //Multiplied by 100 because it is in cents, we convert to dollars
    currency: 'USD',
    customer: customer.id,

    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });
  console.log({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: '',
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: '',
  });
};
