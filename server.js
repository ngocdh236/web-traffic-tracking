require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const Schema = mongoose.Schema;
const TrafficSchema = new Schema({
  web: String,
  visits: Number
});
const Traffic = mongoose.model('traffics', TrafficSchema);

const addTraffic = (req, res) => {
  const { id } = req.params;
  Traffic.findById(id)
    .then(query => {
      if (query) {
        const { web, visits } = query;
        query.visits = visits + 1;
        query
          .save()
          .then(async () => {
            let testAccount = await nodemailer.createTestAccount();
            let transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                user: 'nhimbeobeo@gmail.com',
                type: 'OAuth2',
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                accessToken: process.env.GMAIL_ACCESS_TOKEN,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN
              }
            });

            await transporter.sendMail({
              from: '"Nhim" <nhimbeobeo@gmail.com>',
              to: 'ngocdh236@gmail.com',
              subject: 'Traffic Tracking',
              text: `Some one visited ${web}`
            });

            return res.status(200).json({ success: true });
          })
          .catch(err => res.status(400).json(err));
      }
    })
    .catch(err => res.status(400).json(err));
};

const router = express.Router();
router.post('/:id', addTraffic);

const app = express();
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  next();
});
app.use('/api', router);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
