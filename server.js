require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const notifyTraffic = async (req, res) => {
  const { name } = req.params;
  try {
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET
      }
    });

    await transporter.sendMail({
      from: '"Nhim" <nhimbeobeo@gmail.com>',
      auth: {
        user: 'nhimbeobeo@gmail.com',
        accessToken: process.env.GMAIL_ACCESS_TOKEN,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN
      },
      to: 'ngocdh236@gmail.com',
      subject: 'Traffic Tracking',
      text: `Some one visited ${name}`
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json(err);
  }
};

const router = express.Router();
router.post('/:name', notifyTraffic);

const app = express();
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST');
  next();
});
app.use('/api', router);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
