const express = require('express');
const app = express();
require('dotenv').config();
require('./db');
const bodyParser = require('body-parser');

const paymentRouter = require('./routes/payment');
const userRouter = require('./routes/user');
const partnerRouter = require('./routes/partner');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const productReviewRouter = require('./routes/productReview');
const producerReviewRouter = require('./routes/producerReview');
const cartRouter = require('./routes/cart');
const historyRouter = require('./routes/history');
const sellingHistoryRouter = require('./routes/sellingHistory');
const dialogFlowRouter = require('./routes/dialogFlow');
const refundRouter = require('./routes/refund');

const PORT = process.env.PORT || 8000;

app.use(express.json());

console.log(process.version);
app.use('/api/payment', paymentRouter);
app.use('/api/user', userRouter);
app.use('/api/partner', partnerRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/productReview', productReviewRouter);
app.use('/api/producerReview', producerReviewRouter);
app.use('/api/cart', cartRouter);
app.use('/api/history', historyRouter);
app.use('/api/sellingHistory', sellingHistoryRouter);
app.use('/api/dialogFlow', dialogFlowRouter);
app.use('/api/refund', refundRouter);

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
