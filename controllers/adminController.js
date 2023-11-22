const bannerData = require('../models/bannerSchema');
const citiesData = require('../models/citiesSchema');
const productCategoryData = require('../models/productCategorySchema');
const axios = require('axios');
const sizeOf = require('image-size');
const { getVideoDurationInSeconds } = require('get-video-duration');
const shopRegisterData = require('../models/shopRegisterSchema');
const RegisterData = require('../models/registerSchema');
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
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server error',
      ErrorMessage: error.message,
    });
  }
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
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server error',
      ErrorMessage: error.message,
    });
  }
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
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
      ErrorMessage: error.message,
    });
  }
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
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server error',
      ErrorMessage: error.message,
    });
  }
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
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server error',
      ErrorMessage: error.message,
    });
  }
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
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server error',
      ErrorMessage: error.message,
    });
  }
};

// ============================Shops===========================
// --------------------------Get all shops----------------------------------
exports.viewShops = async (req, res) => {
  try {
    const Data = await shopRegisterData.find();
    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Image Banners fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed getting Image Banners ',
      });
    }
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server error',
      ErrorMessage: error.message,
    });
  }
};

// ============================Banner===========================
// --------------------------Add Banner image----------------------------------
exports.addBannerImage = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  try {
    const bannerImages = req.files && req.files.length > 0 ? req.files : [];

    const validImages = await Promise.all(
      bannerImages.map(async (file) => {
        try {
          // Download the image temporarily
          const response = await axios.get(file.path, {
            responseType: 'arraybuffer',
          });

          // Check the dimensions of the downloaded image
          const dimensions = sizeOf(response.data);
          const width = dimensions.width;
          const height = dimensions.height;
          console.log(`width:${width},height:${height}`);

          // if (width === 970 && height === 250) {
          if (width === 740 && height === 592) {
            // if (width === 2048 && height === 601) {
            const imageUrl = file.path;

            const Data = await bannerData({
              image: imageUrl ? imageUrl : null,
              title: req.body.title,
              description: req.body.description,
            }).save();

            return imageUrl;
          } else {
            throw new Error('Image size is not acceptable (970x250 pixels)');
          }
        } catch (downloadError) {
          console.error('Error downloading image:', downloadError);
          throw new Error('Error downloading image');
        }
      })
    );

    return res.status(201).json({
      Success: true,
      Error: false,
      data: validImages,
      Message: 'Banner added successfully',
    });
  } catch (error) {
    console.error('Error adding banner:', error);
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server error',
      ErrorMessage: error.message,
    });
  }
};
// --------------------------Add Banner video----------------------------------

exports.addBannerVideo = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  try {
    const Banner = {
      title: req.body.title,
      description: req.body.description,
      video:
        req.files && req.files.length > 0
          ? req.files.map((file) => file.path)
          : null,
      videoLength: null, // Initialize videoLength as null
    };

    // Assuming only one video is uploaded
    if (Banner.video && Banner.video.length > 0) {
      const videoPath = Banner.video[0];

      // Get video duration using get-video-duration
      getVideoDurationInSeconds(videoPath)
        .then((duration) => {
          // Assign the duration to Banner.videoLength
          roundOff = Math.floor(duration);
          Banner.videoLength = roundOff;

          // Continue with the rest of your code
          return bannerData(Banner).save();
        })
        .then((Data) => {
          if (Data) {
            return res.status(201).json({
              Success: true,
              Error: false,
              data: Data,
              Message: 'Banner added successfully',
            });
          } else {
            return res.status(400).json({
              Success: false,
              Error: true,
              Message: 'Failed adding Banner ',
            });
          }
        })
        .catch((error) => {
          console.error('Error getting video duration:', error);
          return res.status(500).json({
            Success: false,
            Error: true,
            Message: 'Internal Server error',
            ErrorMessage: error.message,
          });
        });
    } else {
      // Continue with the rest of your code when there are no videos to process
      const Data = await bannerData(Banner).save();
      if (Data) {
        return res.status(201).json({
          Success: true,
          Error: false,
          data: Data,
          Message: 'Banner added successfully',
        });
      } else {
        return res.status(400).json({
          Success: false,
          Error: true,
          Message: 'Failed adding Banner ',
        });
      }
    }
  } catch (error) {
    console.error('Error adding banner:', error);
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server error',
      ErrorMessage: error.message,
    });
  }
};

// --------------------------Get all banner----------------------------------

exports.viewBanners = async (req, res) => {
  try {
    const Data = await bannerData.find();
    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Banners fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed getting Banners ',
      });
    }
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server error',
      ErrorMessage: error.message,
    });
  }
};

// --------------------------Get Video banner----------------------------------
exports.viewVideoBanners = async (req, res) => {
  try {
    const Data = await bannerData.find({
      video: { $ne: [], $not: { $size: 0 } },
    });
    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Video Banners fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed getting Video Banners ',
      });
    }
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server error',
      ErrorMessage: error.message,
    });
  }
};

// --------------------------Get Image banner----------------------------------

exports.viewImageBanners = async (req, res) => {
  try {
    const Data = await bannerData.find({
      image: { $ne: [], $not: { $size: 0 } },
    });
    if (Data) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Image Banners fetched successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed getting Image Banners ',
      });
    }
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server error',
      ErrorMessage: error.message,
    });
  }
};

// ----------------------------Ad Credit point------------------------------------------
exports.adCredit = async (req, res) => {
  try {
    const banner_id = req.params.banner_id;
    const login_id = req.params.login_id;
    // console.log(banner_id);

    const banner_Data = await bannerData.findOne({ _id: banner_id });
    const videoLength = banner_Data.videoLength;
    let creditPoint;
    if (videoLength <= 30) {
      creditPoint = 10;
    }
    if (videoLength > 30) {
      creditPoint = 20;
    }
    console.log(creditPoint);

    const updatedUserData = await RegisterData.updateOne(
      { login_id: login_id },
      // { $set: { credit_points: creditPoint } }
      { $inc: { credit_points: creditPoint } }
    );

    if (updatedUserData) {
      return res.status(200).json({
        Success: true,
        Error: false,
        VideoLength: videoLength,
        CreditPoints: creditPoint,
        Message: 'User ad credit point added successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed adding credit point ',
      });
    }
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server error',
      ErrorMessage: error.message,
    });
  }
};
