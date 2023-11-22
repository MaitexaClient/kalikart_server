const { default: mongoose } = require('mongoose');
const loginData = require('../models/loginSchema');
const productsData = require('../models/productSchema');
const shopRegisterData = require('../models/shopRegisterSchema');

// --------------------------Shops profile--------------------------------

exports.shopProfile = async (req, res) => {
  // console.log(req.params.id);
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

    const profileData = await shopRegisterData.aggregate([
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
          city_id: {
            $first: '$city_id',
          },
          shop_name: {
            $first: '$shop_name',
          },
          email: {
            $first: '$results.email',
          },
          phone: {
            $first: '$phone',
          },
          address: {
            $first: '$address',
          },
          image: {
            $first: '$image',
          },
          // username: {
          //   $first: '$results.username',
          // },
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
      ErrorMessage: error.message, // Display the error message
    });
  }
};

// --------------------------Update shops profile--------------------------------

exports.updateShopProf = async (req, res) => {
  try {
    const previousData = await shopRegisterData.findOne({
      login_id: req.params.id,
    });

    var Shop = {
      login_id: previousData.login_id,
      city_id: req.body ? req.body.city_id : previousData.city_id,
      shop_name: req.body ? req.body.shop_name : previousData.shop_name,
      phone: req.body ? req.body.phone : previousData.phone,
      address: req.body ? req.body.address : previousData.address,
      latitude: req.body ? req.body.latitude : previousData.latitude,
      longitude: req.body ? req.body.longitude : previousData.longitude,
      image:
        req.files && req.files.length > 0
          ? req.files.map((file) => file.path)
          : previousData.image,
    };

    const Data = await shopRegisterData.updateOne(
      { login_id: req.params.id },
      { $set: Shop }
    );

    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Shop profile updated successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed while updating shop profile',
      });
    }
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal server error',
      ErrorMessage: ERROR.message,
    });
  }
};
// --------------------------Add product--------------------------------

exports.addProduct = async (req, res) => {
  try {
    const Product = {
      shop_id: req.body.shop_id,
      category_id: req.body.category_id,
      product_name: req.body.product_name,
      sub_category: req.body.sub_category,
      price: req.body.price,
      available_quantity: req.body.available_quantity,
      offer: req.body.offer,
      image: req.files ? req.files.map((file) => file.path) : null,
      // image: req.file.path,

      description: req.body.description,
    };
    const Data = await productsData(Product).save();
    // console.log(Data);
    if (Data) {
      return res.status(201).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Product added successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed adding Product ',
      });
    }
  } catch (error) {
    return res.status(400).json({
      Success: false,
      Error: true,
      Message: 'Failed adding Product ',
      ErrorMessage: error.message,
    });
  }
};

// --------------------------Update product--------------------------------
exports.updateProduct = async (req, res) => {
  try {
    const previousData = await productsData.findOne({ _id: req.params.id });

    var Product = {
      shop_id: req.body ? req.body.shop_id : previousData.shop_id,
      category_id: req.body ? req.body.category_id : previousData.category_id,
      product_name: req.body
        ? req.body.product_name
        : previousData.product_name,
      sub_category: req.body
        ? req.body.sub_category
        : previousData.sub_category,
      price: req.body ? req.body.price : previousData.price,
      available_quantity: req.body
        ? req.body.available_quantity
        : previousData.available_quantity,
      offer: req.body ? req.body.offer : previousData.offer,
      image: req.files
        ? req.files.map((file) => file.path)
        : previousData.image,
    };

    const Data = await productsData.updateOne(
      { _id: req.params.id },
      { $set: Product }
    );

    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Product updated successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed while updating product',
      });
    }
  } catch (error) {
    return res.status(400).json({
      Success: false,
      Error: true,
      Message: 'Something went wrong',
    });
  }
};

// --------------------------Delete product--------------------------------

exports.deleteProduct = async (req, res) => {
  try {
    const Data = await productsData.deleteOne({ _id: req.params.id });
    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Product deleted successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed to delete product',
      });
    }
  } catch (error) {
    return res.status(400).json({
      Success: false,
      Error: true,
      errorMessage: error,
      Message: 'Something went wrong',
    });
  }
};
