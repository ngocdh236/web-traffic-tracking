require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

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
        query.visits = query.visits + 1;
        query
          .save()
          .then(() => res.status(200).json({ success: true }))
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
