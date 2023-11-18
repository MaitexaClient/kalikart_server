const citiesData = require('../models/citiesSchema');
const productCategoryData = require('../models/productCategorySchema');

// ============================ CITY===========================
// --------------------------Add city ----------------------------------

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
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed adding City ',
      });
    }
  } catch (error) {}
};
// --------------------------Get all city  ----------------------------------

exports.viewCity = async (req, res) => {
  try {
    const Data = await citiesData.find();
    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'City list fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed getting City list ',
      });
    }
  } catch (error) {}
};
// --------------------------Get single city  ----------------------------------

exports.viewSingleCity = async (req, res) => {
  try {
    const Data = await citiesData.findOne({ _id: req.params.id });
    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Single City fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed getting single city',
      });
    }
  } catch (error) {}
};

// --------------------------Get single city ends  ----------------------------------

// ============================Category===========================
// --------------------------Add category  ----------------------------------

exports.addCategory = async (req, res) => {
  try {
    const Category = {
      category: req.body.category,
    };
    const Data = await productCategoryData(Category).save();
    if (Data) {
      return res.status(201).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'category added successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed adding category ',
      });
    }
  } catch (error) {}
};
// --------------------------get all category----------------------------------

exports.viewCategory = async (req, res) => {
  try {
    const Data = await productCategoryData.find();
    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Category list fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed getting Category list ',
      });
    }
  } catch (error) {}
};
// --------------------------get single category----------------------------------

exports.viewSingleCategory = async (req, res) => {
  try {
    const Data = await productCategoryData.findOne({ _id: req.params.id });
    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Single Category fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed getting single Category',
      });
    }
  } catch (error) {
    return res.status(400).json({
      Success: false,
      Error: true,
    });
  }
};
