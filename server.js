const express = require('express');
const app = express();

const mongoose = require('mongoose');
const router = require('./routes/api');

mongoose
  .connect(
    'mongodb+srv://sanjaykvc:eF3XUrcG1Gyxm3gg@kalicart.ctpcffz.mongodb.net/Kalicart',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Database Connected Successfully');
  })
  .catch((error) => {
    console.log('Database Error:', error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.get('/', (req, res) => {
  res.send('server working');
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
