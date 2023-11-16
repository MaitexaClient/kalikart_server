const express = require('express');
const app = express();

const mongoose = require('mongoose');
const commonApi = require('./routes/api');
const adminApi = require('./routes/adminApi');
const shopsApi = require('./routes/shopsApi');
const userApi = require('./routes/userApi');

require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database Connected Successfully');
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

app.get('/', (req, res) => {
  res.send('server working');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
