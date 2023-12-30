const { default: mongoose } = require('mongoose');
const RegisterData = require('../models/registerSchema');
const cartData = require('../models/cartSchema');
const wishlistData = require('../models/wishlistSchema');
const productsData = require('../models/productSchema');
const addressData = require('../models/addressSchema');
const orderData = require('../models/ordersSchema');
const checkoutData = require('../models/checkOutSchema');
// const checkoutData = require('../models/checkoutSchema');

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --------------------------User profile-----------------------------------------
exports.userProfile = async (req, res, next) => {
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
          image: {
            $first: '$image',
          },
          credit_points: {
            $first: '$credit_points',
          },
          credit_points_price: {
            $first: '$credit_points_price',
          },
          email: {
            $first: '$results.email',
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
          login_id: new mongoose.Types.ObjectId(id),
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
    next(error);
  }
};

// --------------------------Update user profile----------------------------------

exports.updateUserProf = async (req, res, next) => {
  // console.log(req.body);
  try {
    var loginID = req.params.id;
    const previousData = await RegisterData.findOne({
      login_id: loginID,
    });
    // ---------------------------user profile update - image & address-------------------------------
    var User = {
      login_id: previousData.login_id,
      name: req.body ? req.body.name : previousData.name,
      phone: req.body ? req.body.phone : previousData.phone,
      image:
        req.files && req.files.length > 0
          ? req.files.map((file) => file.path)
          : previousData.image,
    };

    const Data = await RegisterData.updateOne(
      { login_id: loginID },
      { $set: User }
    );
    // console.log('Data', Data);

    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'User profile updated successfully ',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed while updating user profile',
      });
    }
  } catch (error) {
    next(error);
  }
};

// -------------------------- User address ---------------------------------------
// --------------------------add new address user---------------------------------
exports.addAddress = async (req, res, next) => {
  try {
    // const exAddress = await addressData.findOne({ login_id: req.params.id });
    const exAddress = await addressData
      .findOne({ login_id: req.params.id })
      .sort({ _id: -1 })
      .limit(1);
    const Address = {
      login_id: req.params.id,
      addressCount: exAddress ? exAddress.addressCount + 1 : 1,
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      addressType: exAddress ? '' : 'primary',
      pincode: req.body.pincode,
      state: req.body.state,
      city: req.body.city,
      landmark: req.body.landmark,
    };
    const Data = await addressData(Address).save();
    // console.log(Data);
    if (Data) {
      return res.status(201).json({
        Success: true,
        Error: false,
        data: Data.length > 0 ? Data : [],
        Message: 'Address added successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed adding Address ',
      });
    }
  } catch (error) {
    next(error);
  }
};
// --------------------------set primary address user------------------------------
// await addressData.updateOne(
//   { login_id: loginId, addressType: 'primary' },
//   { $unset: { addressType: '' } }
// );
// const updatedAddress = await addressData.findOneAndUpdate(
//   { login_id: loginId, addressCount: parseInt(addressCount) },
//   { $set: { addressType: 'primary' } },
//   { new: true }
// );
exports.setPrimaryAddress = async (req, res, next) => {
  try {
    const unsetPrimary = await addressData.updateOne(
      { login_id: req.params.id, addressType: 'primary' },
      { $set: { addressType: '' } }
    );
    const setPrimary = await addressData.findOneAndUpdate(
      { login_id: req.params.id, addressCount: parseInt(req.params.count) },
      { $set: { addressType: 'primary' } }
      // { new: true }
    );

    // const unsetPrimary = await addressData.updateOne(
    //   { login_id: req.params.id, addressType: 'primary' },
    //   { $unset: { addressType: '' } }
    // );
    if (setPrimary && unsetPrimary) {
      return res.status(201).json({
        Success: true,
        Error: false,

        Message: 'Primary address selected successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed selecting primary address ',
      });
    }
  } catch (error) {
    next(error);
  }
};
// --------------------------get user address--------------------------------------
exports.getUserAddress = async (req, res, next) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const userAddress = await addressData.find({ login_id: id });
    if (userAddress) {
      res.status(200).json({
        success: true,
        error: false,
        data: userAddress,
        message: 'user address fetched successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        error: true,
        message: 'user address fetching failed',
      });
    }
  } catch (error) {
    next(error);
  }
};
// --------------------------get user primary address-------------------------------

exports.getUserPrimaryAddress = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userAddress = await addressData.findOne({
      login_id: id,
      addressType: 'primary',
    });
    if (userAddress) {
      res.status(200).json({
        success: true,
        error: false,
        data: userAddress,
        message: 'user primary address fetched successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        error: true,
        message: 'user primary address fetching failed',
      });
    }
  } catch (error) {
    next(error);
  }
};
// --------------------------update user address-------------------------------------
exports.updateUserAddress = async (req, res, next) => {
  const id = req.params.id;

  try {
    const prevUserAddress = await addressData.findOne({
      _id: id,
    });
    // console.log(prevUserAddress);

    var updatedAddress = {
      login_id: prevUserAddress.login_id,
      addressCount: req.body
        ? req.body.addressCount
        : prevUserAddress.addressCount,
      name: req.body ? req.body.name : prevUserAddress.name,
      phone: req.body.phone ? req.body.phone : prevUserAddress.phone,
      address: req.body ? req.body.address : prevUserAddress.address,
      pincode: req.body ? req.body.pincode : prevUserAddress.pincode,
      state: req.body ? req.body.state : prevUserAddress.state,
      city: req.body ? req.body.city : prevUserAddress.city,
      landmark: req.body ? req.body.landmark : prevUserAddress.landmark,
      addressType: req.body
        ? req.body.addressType
        : prevUserAddress.addressType,
    };

    const updatedData = await addressData.updateOne(
      { _id: id },
      { $set: updatedAddress }
    );

    if (updatedData) {
      res.status(200).json({
        success: true,
        error: false,
        data: updatedData,
        message: 'user address updated successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        error: true,
        message: 'user address updating failed',
      });
    }
  } catch (error) {
    next(error);
  }
};

// --------------------------delete user address--------------------------------------

exports.deleteUserAddress = async (req, res, next) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const userAddress = await addressData.deleteOne({ _id: id });
    if (userAddress) {
      res.status(200).json({
        success: true,
        error: false,
        data: userAddress,
        message: 'user address deleted successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        error: true,
        message: 'user address deletion failed',
      });
    }
  } catch (error) {
    next(error);
  }
};
// ------------------------------ Product --------------------------------------------
// ----------------------------Get all product----------------------------------------

exports.viewProducts = async (req, res, next) => {
  try {
    const Data = await productsData.find();
    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Products fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed getting Products ',
      });
    }
  } catch (error) {
    next(error);
  }
};

// --------------------------Get shuffled products-----------------------------------
exports.viewShuffledProducts = async (req, res, next) => {
  try {
    const data = await productsData.find();

    if (data && data.length > 0) {
      const shuffledData = shuffleArray(data);

      return res.status(200).json({
        Success: true,
        Error: false,
        data: shuffledData,
        Message: 'Products fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed getting Products ',
      });
    }
  } catch (error) {
    // console.error(error);
    next(error);
  }
};
// --------------------------Get trending products-----------------------------------
exports.viewTrendingProducts = async (req, res, next) => {
  try {
    const data = await productsData.find();

    if (data && data.length > 0) {
      const shuffledData = shuffleArray(data);

      const slicedData = shuffledData.slice(0, 10);

      return res.status(200).json({
        Success: true,
        Error: false,
        data: slicedData,
        Count: slicedData.length,
        TotalCount: data.length,
        Message: 'Products fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed getting Products ',
      });
    }
  } catch (error) {
    next(error);
  }
};
// --------------------------Get filtered product by category------------------------
exports.filterProducts = async (req, res, next) => {
  try {
    const id = req.params.id;
    // const Data = await productsData.find();
    const Data = await productsData.find({ category_id: id });
    if (Data.length > 0) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Products filtered successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed filtering products',
      });
    }
  } catch (error) {
    next(error);
  }
};
// --------------------------Get filtered product by sub category--------------------
exports.filterSubProducts = async (req, res, next) => {
  try {
    const sub_category = req.params.subcategory;
    // console.log(sub_category);
    // const Data = await productsData.find();
    const Data = await productsData.find({ sub_category: sub_category });
    if (Data.length > 0) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Products filtered successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed filtering products',
      });
    }
  } catch (error) {
    next(error);
  }
};
// --------------------------Get filtered product by sub category under category-----
exports.filterCatSubProducts = async (req, res, next) => {
  try {
    const category = req.params.category;
    // console.log(category);
    // const Data = await productsData.find();
    // const Data = await productsData.find({ category_id: category });
    const Data = await productsData.distinct('sub_category', {
      category_id: category,
    });
    if (Data.length > 0) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Products filtered successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed filtering products',
      });
    }
  } catch (error) {
    next(error);
  }
};
// --------------------------Get filtered product by price range---------------------
exports.filterPriceProducts = async (req, res, next) => {
  try {
    const start_range = req.params.start;
    const end_range = req.params.end;
    // console.log(start_range);
    // console.log(start_range);
    // const Data = await productsData.find();
    const Data = await productsData.find({
      price: { $gte: start_range, $lte: end_range },
    });
    if (Data.length > 0) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'No products in that range',
      });
    }
  } catch (error) {
    next(error);
  }
};
// --------------------------Get filtered product by search key----------------------
exports.searchProducts = async (req, res, next) => {
  try {
    const searchKey = req.params.searchKey;
    // console.log(searchKey);
    // const Data = await productsData.find();
    const Data = await productsData.find({
      // product_name: { searchKey },
      // $or: [
      //   { product_name: { $regex: searchKey, $options: 'i' } },
      //   { sub_category: { $regex: searchKey, $options: 'i' } },
      // ],

      product_name: { $regex: searchKey, $options: 'i' },
    });
    if (Data.length > 0) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'No products found',
      });
    }
  } catch (error) {
    next(error);
  }
};
// --------------------------Get single product--------------------------------------

exports.viewSingleProduct = async (req, res, next) => {
  try {
    const Data = await productsData.findOne({ _id: req.params.id });
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
  } catch (error) {
    next(error);
  }
};

// -------------------------- Cart ---------------------------------------------------
// -------------------------- Add to cart --------------------------------------------

exports.addToCart = async (req, res, next) => {
  try {
    const login_id = req.params.user_id;
    const productId = req.params.prod_id;

    const existingProduct = await cartData.findOne({
      product_id: productId,
      login_id: login_id,
    });
    if (existingProduct) {
      const quantity = existingProduct.quantity;
      const updatedQuantity = quantity + 1;

      const updatedData = await cartData.updateOne(
        { _id: existingProduct._id },
        { $set: { quantity: updatedQuantity } }
      );

      return res.status(200).json({
        success: true,
        error: false,
        data: updatedData,
        message: 'incremented existing product quantity',
      });
    } else {
      const cartDatas = {
        login_id: login_id,
        product_id: productId,
        price: req.body.price,
      };
      const Data = await cartData(cartDatas).save();
      if (Data) {
        return res.status(200).json({
          Success: true,
          Error: false,
          data: Data,
          Message: 'Product added to cart successfully',
        });
      } else {
        return res.status(400).json({
          Success: false,
          Error: true,
          Message: 'Product adding failed',
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

// -------------------------- Cart view ----------------------------------------------

exports.viewCart = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    // console.log(user_id);

    const cartProducts = await cartData.aggregate([
      {
        $lookup: {
          from: 'products_tbs',
          localField: 'product_id',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $unwind: {
          path: '$result',
        },
      },
      {
        $group: {
          _id: '$_id',
          login_id: {
            $first: '$login_id',
          },
          product_id: {
            $first: '$product_id',
          },
          product_name: {
            $first: '$result.product_name',
          },
          sub_category: {
            $first: '$result.sub_category',
          },
          offer: {
            $first: '$result.offer',
          },
          price: {
            $first: '$price',
          },
          quantity: {
            $first: '$quantity',
          },
          image: {
            $first: {
              $cond: {
                if: { $ne: ['$result.image', null] },
                then: '$result.image',
                else: 'default_image_url',
              },
            },
          },
        },
      },
      {
        $addFields: {
          subtotal: { $multiply: ['$price', '$quantity'] },
        },
      },
      {
        $match: {
          login_id: new mongoose.Types.ObjectId(user_id),
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$subtotal',
          },
          cartProducts: {
            $push: {
              _id: '$_id',
              login_id: '$login_id',
              product_id: '$product_id',
              product_name: '$product_name',
              sub_category: '$sub_category',
              offer: '$offer',
              price: '$price',
              quantity: '$quantity',
              subtotal: '$subtotal',
              image: '$image',
            },
          },
        },
      },
    ]);
    if (cartProducts.length) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: cartProducts.length > 0 ? cartProducts : [],
        Message: 'Product fetched from cart successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Product fetching from cart failed',
      });
    }
  } catch (error) {
    next(error);
  }
};

// -------------------------- Increment cart quantity  --------------------------------
exports.incrementQuantity = async (req, res, next) => {
  cartData
    .findOne({
      _id: req.params.id,
      login_id: req.params.user_id,
    })
    .then((data) => {
      const quantity = data.quantity;
      const updatedQuantity = quantity + 1;
      cartData
        .updateOne({ _id: data.id }, { $set: { quantity: updatedQuantity } })
        .then((data) => {
          return res.status(200).json({
            success: true,
            error: false,
            data: data,
            message: 'updated successfully',
          });
        })
        .catch((err) =>
          console.log('error while updating quantity ', err.message)
        );
    })
    .catch((err) => console.log('error while getting data', err.message));
};

// -------------------------- Decrement cart quantity  --------------------------------

exports.decrementQuantity = async (req, res, next) => {
  cartData
    .findOne({
      _id: req.params.id,
      login_id: req.params.user_id,
    })
    .then((data) => {
      const quantity = data.quantity;
      const updatedQuantity = quantity - 1;
      // console.log('updatedquantity', updatedQuantity);
      if (updatedQuantity == 0) {
        // console.log('quantity is zero');
        cartData
          .deleteOne({ _id: req.params.id })
          .then(() => {
            return res.status(200).json({
              success: true,
              error: false,
              message: 'deletion successful',
            });
          })
          .catch((err) => console.log('error while deleting '));
      }
      cartData
        .updateOne({ _id: data.id }, { $set: { quantity: updatedQuantity } })
        .then((data) => {
          return res.status(200).json({
            success: true,
            error: false,
            data: data,
            message: 'updated successfully',
          });
        })
        .catch((err) => console.log('error while updating '));
    })
    .catch((err) => console.log('error while getting data'));
};
// -------------------------- Remove from cart ----------------------------------------
exports.deleteFromCart = async (req, res, next) => {
  try {
    cartData
      .deleteOne({ _id: req.params.id, login_id: req.params.user_id })
      .then(() => {
        return res.status(200).json({
          success: true,
          error: false,
          message: 'product deletion from cart successful',
        });
      })
      .catch((error) => {
        return res.status(400).json({
          success: false,
          error: true,
          message: 'product deletion from cart failed',
          ErrorMessage: error.message,
        });
      });
  } catch (error) {
    next(error);
  }
};
// -------------------------- Wishlist ------------------------------------------------
// -------------------------- Add to wishlist -----------------------------------------
exports.addToWishlist = async (req, res, next) => {
  try {
    const login_id = req.params.user_id;
    const productId = req.params.prod_id;

    const existingProduct = await wishlistData.findOne({
      login_id: login_id,
      product_id: productId,
    });
    if (!existingProduct) {
      const wishlistDatas = {
        login_id: login_id,
        product_id: productId,
      };

      const Data = await wishlistData(wishlistDatas).save();
      if (Data) {
        return res.status(200).json({
          Success: true,
          Error: false,
          data: Data,
          Message: 'Product added to wishlist successfully',
        });
      } else {
        return res.status(400).json({
          Success: false,
          Error: true,
          Message: 'Product adding to wishlist failed',
        });
      }
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Product already exist in wishlist',
      });
    }
  } catch (error) {
    next(error);
  }
};

// -------------------------- View wishlist ------------------------------------------

exports.viewWishlist = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    // console.log(user_id);

    const wishlistProducts = await wishlistData.aggregate([
      {
        $lookup: {
          from: 'products_tbs',
          localField: 'product_id',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $unwind: {
          path: '$result',
        },
      },
      {
        $group: {
          _id: '$_id',
          login_id: {
            $first: '$login_id',
          },
          product_id: {
            $first: '$product_id',
          },
          product_name: {
            $first: '$result.product_name',
          },
          sub_category: {
            $first: '$result.sub_category',
          },
          offer: {
            $first: '$result.offer',
          },
          price: {
            $first: '$result.price',
          },
          image: {
            $first: {
              $cond: {
                if: { $ne: ['$result.image', null] },
                then: '$result.image',
                else: 'default_image_url',
              },
            },
          },
        },
      },

      {
        $match: {
          login_id: new mongoose.Types.ObjectId(user_id),
        },
      },
    ]);
    if (wishlistProducts) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: wishlistProducts.length > 0 ? wishlistProducts : [],
        Message: 'Product fetched from wishlist successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Product fetching from wishlist failed',
      });
    }
  } catch (error) {
    next(error);
  }
};

// -------------------------- Remove from wishlist -----------------------------------

exports.deleteFromWishlist = async (req, res, next) => {
  try {
    wishlistData
      .deleteOne({ _id: req.params.id, login_id: req.params.user_id })
      .then(() => {
        return res.status(200).json({
          success: true,
          error: false,
          message: 'product deletion from wishlist successful',
        });
      })
      .catch((error) => {
        return res.status(400).json({
          success: false,
          error: true,
          message: 'product deletion from wishlist failed',
          ErrorMessage: error.message,
        });
      });
  } catch (error) {
    next(error);
  }
};

// -------------------------- User Checkout ------------------------------------------
exports.checkOut = async (req, res, next) => {
  try {
    const dataToCopy = await cartData.find({ login_id: req.params.user_id });
    if (dataToCopy.length === 0) {
      return res
        .status(404)
        .json({ message: 'No data found for the specified user ID' });
    }

    const dataWithOrderStatus = dataToCopy.map((item) => ({
      ...item.toObject(),
      order_status: 'pending',
    }));

    await checkoutData.insertMany(dataWithOrderStatus);
    // await cartData.deleteMany({ login_id: req.params.user_id });
    return res.status(200).json({
      message: 'Checkout data added successfully!',
    });
  } catch (error) {
    // console.error(error);
    next(error);
  }
};

// -------------------------- User view checkout products ------------------
exports.viewCheckout = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    // console.log(user_id);

    const checkoutProducts = await checkoutData.aggregate([
      {
        $lookup: {
          from: 'products_tbs',
          localField: 'product_id',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $unwind: {
          path: '$result',
        },
      },
      {
        $group: {
          _id: '$_id',
          login_id: {
            $first: '$login_id',
          },
          product_id: {
            $first: '$product_id',
          },
          product_name: {
            $first: '$result.product_name',
          },
          quantity: {
            $first: '$quantity',
          },
          subtotal: {
            $first: '$subtotal',
          },
          offer: {
            $first: '$result.offer',
          },
          description: {
            $first: '$result.description',
          },
          price: {
            $first: '$result.price',
          },
          order_status: {
            $first: '$order_status',
          },
          image: {
            $first: {
              $cond: {
                if: {
                  $ne: ['$result.image', null],
                },
                then: '$result.image',
                else: 'default_image_url',
              },
            },
          },
        },
      },
      {
        $match: {
          login_id: new mongoose.Types.ObjectId(user_id),
        },
      },
    ]);
    if (checkoutProducts) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: checkoutProducts.length > 0 ? checkoutProducts : [],
        Message: 'Product fetched from checkout successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Product fetching from checkout failed',
      });
    }
  } catch (error) {
    next(error);
  }
};

// -------------------------- User checkout status update completed ------------------
exports.updateOrderStatus = async (req, res, next) => {
  try {
    // console.log(req.params.status);
    // console.log(typeof req.params.status);
    const addr_id = req.params.address_id;
    console.log('address', addr_id);
    const currentDate = new Date();
    if (req.params.status === '1') {
      console.log('test', addr_id);
      await checkoutData.updateMany(
        { login_id: req.params.user_id },
        {
          $set: {
            order_status: 'completed',
            order_date: currentDate,
            address_id: addr_id,
          },
        }
      );

      const dataToCopy = await checkoutData.find({
        login_id: req.params.user_id,
      });
      if (dataToCopy.length === 0) {
        return res
          .status(404)
          .json({ message: 'No data found for the specified user ID' });
      }

      const dataWithOrderStatus = dataToCopy.map((item) => ({
        ...item.toObject(),
      }));

      const addOrders = await orderData.insertMany(dataWithOrderStatus);
      const delCart = await cartData.deleteMany({
        login_id: req.params.user_id,
      });
      const delCheckout = await checkoutData.deleteMany({
        login_id: req.params.user_id,
      });
      if (addOrders && delCart && delCheckout) {
        return res
          .status(200)
          .json({ message: 'Order status completed updated successfully!' });
      }
    } else {
      const updateOrder = await checkoutData.updateMany(
        { login_id: req.params.user_id },
        {
          $set: {
            order_status: 'cancelled',
            order_date: currentDate,
            address_id: addr_id,
          },
        }
      );
      if (updateOrder) {
        return res
          .status(200)
          .json({ message: 'Order status cancelled updated successfully!' });
      }

      const dataToCopy = await checkoutData.find({
        login_id: req.params.user_id,
      });
      if (dataToCopy.length === 0) {
        return res
          .status(404)
          .json({ message: 'No data found for the specified user ID' });
      }

      const dataWithOrderStatus = dataToCopy.map((item) => ({
        ...item.toObject(),
      }));

      await orderData.insertMany(dataWithOrderStatus);
      await checkoutData.deleteMany({ login_id: req.params.user_id });
    }
  } catch (error) {
    // console.error(error);
    next(error);
  }
};

// -------------------------- User orders --------------------------------------------

exports.viewOrders = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    // console.log(user_id);

    const Orders = await orderData.aggregate([
      {
        $lookup: {
          from: 'products_tbs',
          localField: 'product_id',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $unwind: {
          path: '$result',
        },
      },
      {
        $group: {
          _id: '$_id',
          login_id: {
            $first: '$login_id',
          },
          address_id: {
            $first: '$address_id',
          },
          product_name: {
            $first: '$result.product_name',
          },
          quantity: {
            $first: '$quantity',
          },
          subtotal: {
            $first: '$subtotal',
          },
          offer: {
            $first: '$result.offer',
          },
          description: {
            $first: '$result.description',
          },
          price: {
            $first: '$result.price',
          },
          order_status: {
            $first: '$order_status',
          },
          image: {
            $first: {
              $cond: {
                if: {
                  $ne: ['$result.image', null],
                },
                then: '$result.image',
                else: 'default_image_url',
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'address_tbs',
          localField: 'address_id',
          foreignField: '_id',
          as: 'address',
        },
      },
      {
        $unwind: {
          path: '$address',
        },
      },
      {
        $group: {
          _id: '$_id',
          login_id: {
            $first: '$login_id',
          },
          address_id: {
            $first: '$address_id',
          },
          product_name: {
            $first: '$product_name',
          },
          quantity: {
            $first: '$quantity',
          },
          subtotal: {
            $first: '$subtotal',
          },
          offer: {
            $first: '$offer',
          },
          description: {
            $first: '$description',
          },
          price: {
            $first: '$price',
          },
          order_status: {
            $first: '$order_status',
          },
          image: {
            $first: {
              $cond: {
                if: {
                  $ne: ['$image', null],
                },
                then: '$image',
                else: 'default_image_url',
              },
            },
          },
          name: {
            $first: '$address.name',
          },
          phone: {
            $first: '$address.phone',
          },
          addressCount: {
            $first: '$address.addressCount',
          },
          address: {
            $first: '$address.address',
          },
          pincode: {
            $first: '$address.pincode',
          },
          city: {
            $first: '$address.city',
          },
          state: {
            $first: '$address.state',
          },
          landmark: {
            $first: '$address.landmark',
          },
          addressType: {
            $first: '$address.addressType',
          },
        },
      },
      {
        $match: {
          login_id: new mongoose.Types.ObjectId(user_id),
        },
      },
    ]);
    if (Orders) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Orders.length > 0 ? Orders : [],
        Message: 'Orders fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Orders fetching failed',
      });
    }
  } catch (error) {
    next(error);
  }
};

// -------------------------- User orders filter by completed --------------------------------------------
exports.filterOrdersCompleted = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    // console.log(user_id);

    const Orders = await orderData.aggregate([
      {
        $lookup: {
          from: 'products_tbs',
          localField: 'product_id',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $unwind: {
          path: '$result',
        },
      },
      {
        $group: {
          _id: '$_id',
          login_id: {
            $first: '$login_id',
          },
          address_id: {
            $first: '$address_id',
          },
          product_name: {
            $first: '$result.product_name',
          },
          quantity: {
            $first: '$quantity',
          },
          subtotal: {
            $first: '$subtotal',
          },
          offer: {
            $first: '$result.offer',
          },
          description: {
            $first: '$result.description',
          },
          price: {
            $first: '$result.price',
          },
          order_status: {
            $first: '$order_status',
          },
          image: {
            $first: {
              $cond: {
                if: {
                  $ne: ['$result.image', null],
                },
                then: '$result.image',
                else: 'default_image_url',
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'address_tbs',
          localField: 'address_id',
          foreignField: '_id',
          as: 'address',
        },
      },
      {
        $unwind: {
          path: '$address',
        },
      },
      {
        $group: {
          _id: '$_id',
          login_id: {
            $first: '$login_id',
          },
          address_id: {
            $first: '$address_id',
          },
          product_name: {
            $first: '$product_name',
          },
          quantity: {
            $first: '$quantity',
          },
          subtotal: {
            $first: '$subtotal',
          },
          offer: {
            $first: '$offer',
          },
          description: {
            $first: '$description',
          },
          price: {
            $first: '$price',
          },
          order_status: {
            $first: '$order_status',
          },
          image: {
            $first: {
              $cond: {
                if: {
                  $ne: ['$image', null],
                },
                then: '$image',
                else: 'default_image_url',
              },
            },
          },
          name: {
            $first: '$address.name',
          },
          phone: {
            $first: '$address.phone',
          },
          addressCount: {
            $first: '$address.addressCount',
          },
          address: {
            $first: '$address.address',
          },
          pincode: {
            $first: '$address.pincode',
          },
          city: {
            $first: '$address.city',
          },
          state: {
            $first: '$address.state',
          },
          landmark: {
            $first: '$address.landmark',
          },
          addressType: {
            $first: '$address.addressType',
          },
        },
      },
      {
        $match: {
          login_id: new mongoose.Types.ObjectId(user_id),
          order_status: 'completed',
        },
      },
    ]);

    if (Orders) {
      return res.status(200).json({
        Success: true,
        Error: false,
        dataCount: Orders.length,
        data: Orders.length > 0 ? Orders : [],
        Message: 'Completed orders fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Completed orders fetching failed',
      });
    }
  } catch (error) {
    next(error);
  }
};

// -------------------------- User orders filter by cancelled --------------------------------------------
exports.filterOrdersCancelled = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;
    // console.log(user_id);

    const Orders = await orderData.aggregate([
      {
        $lookup: {
          from: 'products_tbs',
          localField: 'product_id',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $unwind: {
          path: '$result',
        },
      },
      {
        $group: {
          _id: '$_id',
          login_id: {
            $first: '$login_id',
          },
          address_id: {
            $first: '$address_id',
          },
          product_name: {
            $first: '$result.product_name',
          },
          quantity: {
            $first: '$quantity',
          },
          subtotal: {
            $first: '$subtotal',
          },
          offer: {
            $first: '$result.offer',
          },
          description: {
            $first: '$result.description',
          },
          price: {
            $first: '$result.price',
          },
          order_status: {
            $first: '$order_status',
          },
          image: {
            $first: {
              $cond: {
                if: {
                  $ne: ['$result.image', null],
                },
                then: '$result.image',
                else: 'default_image_url',
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'address_tbs',
          localField: 'address_id',
          foreignField: '_id',
          as: 'address',
        },
      },
      {
        $unwind: {
          path: '$address',
        },
      },
      {
        $group: {
          _id: '$_id',
          login_id: {
            $first: '$login_id',
          },
          address_id: {
            $first: '$address_id',
          },
          product_name: {
            $first: '$product_name',
          },
          quantity: {
            $first: '$quantity',
          },
          subtotal: {
            $first: '$subtotal',
          },
          offer: {
            $first: '$offer',
          },
          description: {
            $first: '$description',
          },
          price: {
            $first: '$price',
          },
          order_status: {
            $first: '$order_status',
          },
          image: {
            $first: {
              $cond: {
                if: {
                  $ne: ['$image', null],
                },
                then: '$image',
                else: 'default_image_url',
              },
            },
          },
          name: {
            $first: '$address.name',
          },
          phone: {
            $first: '$address.phone',
          },
          addressCount: {
            $first: '$address.addressCount',
          },
          address: {
            $first: '$address.address',
          },
          pincode: {
            $first: '$address.pincode',
          },
          city: {
            $first: '$address.city',
          },
          state: {
            $first: '$address.state',
          },
          landmark: {
            $first: '$address.landmark',
          },
          addressType: {
            $first: '$address.addressType',
          },
        },
      },
      {
        $match: {
          login_id: new mongoose.Types.ObjectId(user_id),
          order_status: 'cancelled',
        },
      },
    ]);

    if (Orders) {
      return res.status(200).json({
        Success: true,
        Error: false,
        dataCount: Orders.length,
        data: Orders.length > 0 ? Orders : [],
        Message: 'Cancelled orders fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Cancelled orders fetching failed',
      });
    }
  } catch (error) {
    next(error);
  }
};

// --------------------------------- Checkout Applying wallet   --------------------------------------------

exports.checkOutWallet = async (req, res, next) => {
  try {
  //  user_id,walletamount

    const userCheckOutData=await checkoutData.findOne({_id:req.params.id})

    return res.status(200).json({
      message: 'Checkout data added successfully!',
    });
  } catch (error) {
    // console.error(error);
    next(error);
  }
};
