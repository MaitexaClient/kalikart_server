const express = require('express');
const app = express();
const moment = require('moment');
const mongoose = require('mongoose');
const commonApi = require('./routes/api');
const adminApi = require('./routes/adminApi');
const shopsApi = require('./routes/shopsApi');
const userApi = require('./routes/userApi');
const watchedAdData = require('./models/watchedAds');
const ErrorHandler  = require('./middlewares/ErrorHandler');

require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database Connected Successfully');
    deleteDocumentsOlderThanOneDay();
  })
  .catch((error) => {
    console.log('Database Error:', error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', commonApi);
app.use('/api', adminApi);
app.use('/api', shopsApi);
app.use('/api', userApi);
app.use(ErrorHandler)

app.get('/', (req, res) => {
  res.send('server working');
});

async function deleteDocumentsOlderThanOneDay() {
  try {
    // Set the date threshold for one day ago
    const checkDate = moment().subtract(1, 'day');

    // Find documents with watchDate older than checkDate
    const documentsToDelete = await watchedAdData.find({
      watchDate: { $lt: checkDate.toDate() },
    });

    // Delete the found documents
    const deleteResult = await watchedAdData.deleteMany({
      _id: { $in: documentsToDelete.map((doc) => doc._id) },
    });

    // console.log(
    //   `Deleted ${deleteResult.deletedCount} documents older than one day.`
    // );
  } catch (error) {
    console.error('Error deleting documents:', error);
  }
}

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
