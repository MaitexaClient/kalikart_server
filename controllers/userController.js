const { default: mongoose } = require('mongoose');
const RegisterData = require('../models/registerSchema');
const cartData = require('../models/cartSchema');
const wishlistData = require('../models/wishlistSchema');
const productsData = require('../models/productSchema');

// --------------------------User profile
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
          image: {
            $first: '$image',
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
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Something went wrong',
      ErrorMessage: error.message,
    });
  }
};
// --------------------------Update user profile--------------------------------

exports.updateUserProf = async (req, res) => {
  try {
    const previousData = await RegisterData.findOne({
      login_id: req.params.id,
    });
    // console.log(previousData.image);
    var User = {
      login_id: previousData.login_id,
      name: req.body ? req.body.shop_name : previousData.shop_name,
      phone: req.body ? req.body.phone : previousData.phone,
      image:
        req.files && req.files.length > 0
          ? req.files.map((file) => file.path)
          : previousData.image,
    };

    const Data = await RegisterData.updateOne(
      { login_id: req.params.id },
      { $set: User }
    );

    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'User profile updated successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed while updating user profile',
      });
    }
  } catch (error) {
    return res.status(400).json({
      Success: false,
      Error: true,
      Message: 'Internal server error',
      Error: error.message,
    });
  }
};

// ------------------------- Product ------------------------------------
// --------------------------Get all product--------------------------------

exports.viewProducts = async (req, res) => {
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
  } catch (error) {}
};

// --------------------------Get filtered product by category--------------------------------
exports.filterProducts = async (req, res) => {
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
    return res.status(400).json({
      Success: false,
      Error: true,
      Message: 'Internal server error',
      ErrorMessage: error.message,
    });
  }
};
// --------------------------Get filtered product by sub category--------------------------------
exports.filterSubProducts = async (req, res) => {
  try {
    const sub_category = req.params.subcategory;
    console.log(sub_category);
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
    return res.status(400).json({
      Success: false,
      Error: true,
      Message: 'Internal server error',
      ErrorMessage: error.message,
    });
  }
};
// --------------------------Get filtered product by sub category under category--------------------------------
exports.filterCatSubProducts = async (req, res) => {
  try {
    const category = req.params.category;
    console.log(category);
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
    return res.status(400).json({
      Success: false,
      Error: true,
      Message: 'Internal server error',
      ErrorMessage: error.message,
    });
  }
};
// --------------------------Get filtered product by price range--------------------------------
exports.filterPriceProducts = async (req, res) => {
  try {
    const start_range = req.params.start;
    const end_range = req.params.end;
    console.log(start_range);
    console.log(start_range);
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
    return res.status(400).json({
      Success: false,
      Error: true,
      Message: 'Internal server error',
      ErrorMessage: error.message,
    });
  }
};
// --------------------------Get filtered product by search key--------------------------------
exports.searchProducts = async (req, res) => {
  try {
    const searchKey = req.params.searchKey;
    console.log(searchKey);
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
    return res.status(400).json({
      Success: false,
      Error: true,
      Message: 'Internal server error',
      ErrorMessage: error.message,
    });
  }
};
// --------------------------Get single product--------------------------------

exports.viewSingleProduct = async (req, res) => {
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
    return res.status(400).json({
      Success: false,
      Error: true,
      errorMessage: error,
      Message: 'Something went wrong',
    });
  }
};
// -------------------------- Cart --------------------------------------
// -------------------------- Add to cart --------------------------------

exports.addToCart = async (req, res) => {
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
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal server error',
      ErrorMessage: error.message,
    });
  }
};

// -------------------------- Cart view --------------------------------

exports.viewCart = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    console.log(user_id);

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
    if (cartProducts.length > 0) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: cartProducts,
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
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal server error',
      ErrorMessage: error.message,
    });
  }
};

// -------------------------- Increment cart quantity  --------------------------------
exports.incrementQuantity = async (req, res) => {
  cartData
    .findOne({
      _id: req.params.id,
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

exports.decrementQuantity = async (req, res) => {
  cartData
    .findOne({
      _id: req.params.id,
    })
    .then((data) => {
      const quantity = data.quantity;
      const updatedQuantity = quantity - 1;
      console.log('updatedquantity', updatedQuantity);
      if (updatedQuantity == 0) {
        console.log('quantity is zero');
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

// -------------------------- Wishlist --------------------------------
// -------------------------- Add to wishlist --------------------------------
exports.addToWishlist = async (req, res) => {
  try {
    const login_id = req.params.user_id;
    const productId = req.params.prod_id;

    const existingProduct = await wishlistData.findOne({
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
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal server error',
      ErrorMessage: error.message,
    });
  }
};

// -------------------------- View wishlist --------------------------------

exports.viewWishlist = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    console.log(user_id);

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
    if (wishlistProducts.length > 0) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: wishlistProducts,
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
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal server error',
      ErrorMessage: error.message,
    });
  }
};
