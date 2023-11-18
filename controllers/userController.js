const { default: mongoose } = require('mongoose');
const RegisterData = require('../models/registerSchema');

exports.userProfile = async (req, res) => {
  //   console.log(req.params.id);
  try {
    const id = req.params.id;

    // Check if the provided ID is a valid ObjectId
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({
    //     Success: false,
    //     Error: true,
    //     Message: 'Invalid ID format',
    //   });
    // }

    const profileData = await RegisterData.aggregate([
      {
        $lookup: {
          from: 'login_tbs',
          localField: 'login_id',
          foreignField: '_id',
          as: 'results',
        },
      },
      {
        $unwind: '$results',
      },
      {
        $group: {
          _id: '$_id',
          login_id: {
            $first: '$login_id',
          },
          name: {
            $first: '$name',
          },
          phone: {
            $first: '$phone',
          },
          email: {
            $first: '$email',
          },
          username: {
            $first: '$results.username',
          },
          password: {
            $first: '$results.password',
          },
        },
      },

      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
    ]);

    if (profileData.length > 0) {
      return res.json({
        Success: true,
        Error: false,
        data: profileData,
        Message: 'Success',
      });
    } else {
      return res.json({
        Success: false,
        Error: true,
        Message: 'Failed',
      });
    }
  } catch (error) {
    return res.status(400).json({
      Success: false,
      Error: true,
      Message: 'Something went wrong',
      ErrorMessage: error.message,
    });
  }
};
