const citiesData = require('../models/citiesSchema');

// ============================Add city===========================
exports.addCity = async (req, res) => {
  try {
    const City = {
      city: req.body.city,
    };
    const Data = await citiesData(City).save();
    if (Data) {
      return res.status(201).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'City added successfully',
      });
    } else {
      return res.status(201).json({
        Success: false,
        Error: true,
        Message: 'Failed adding City ',
      });
    }
  } catch (error) {}
};
// --------------------------Add city ends ----------------------------------

// ==========================View all city===========================

exports.viewCity = async (req, res) => {
  try {
    const Data = await citiesData.find();
    if (Data) {
      return res.status(201).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'City list fetched successfully',
      });
    } else {
      return res.status(201).json({
        Success: false,
        Error: true,
        Message: 'Failed getting City list ',
      });
    }
  } catch (error) {}
};
exports.viewSingleCity = async (req, res) => {
  try {
    const Data = await citiesData.findOne({ _id: req.params.id });
    if (Data) {
      return res.status(201).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Single City fetched successfully',
      });
    } else {
      return res.status(201).json({
        Success: false,
        Error: true,
        Message: 'Failed getting single city',
      });
    }
  } catch (error) {}
};
