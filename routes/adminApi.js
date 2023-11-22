const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const registrationController = require('../controllers/registrationController');
const adminController = require('../controllers/adminController');

// ===========================Image/Video upload=====================================

const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
const storageImage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Kalicart/bannerImage',
  },
});
const storageVideo = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Kalicart/bannerVideo',
    resource_type: 'video',
  },
});
const uploadImage = multer({ storage: storageImage });
const uploadVideo = multer({ storage: storageVideo });

// ===============================================================================
// ------------------------------Admin--------------------------------------------
// ===============================================================================
//----------------------------Add city--------------------------------------------
router.post('/add-city', adminController.addCity);
router.get('/view-city', adminController.viewCity);
router.get('/view-city/:id', adminController.viewSingleCity);

//----------------------------Add category--------------------------------------------

router.post('/add-category', adminController.addCategory);
router.get('/view-category', adminController.viewCategory);
router.get('/view-category/:id', adminController.viewSingleCategory);

// ===============================Shops===================================================
//----------------------------Get all Shops--------------------------------------------

router.get('/view-shops', adminController.viewShops);

// ==================================================================================

// ===============================Banner===================================================
//----------------------------Add banner--------------------------------------------
router.post(
  '/add-banner-image',
  uploadImage.array('image', 5),
  adminController.addBannerImage
);
router.post(
  '/add-banner-video',
  uploadVideo.array('video', 3),
  adminController.addBannerVideo
);
//----------------------------View all banner--------------------------------------------

router.get('/view-banners', adminController.viewBanners);
//----------------------------View Video banner--------------------------------------------
router.get('/view-banners/videos', adminController.viewVideoBanners);
//----------------------------View Image banner--------------------------------------------

router.get('/view-banners/images', adminController.viewImageBanners);

// -----------------------------------------------------------------------------------
module.exports = router;

// --------------------------------Ad credits-------------------------------------------
router.put('/banner-credit/:banner_id/:login_id', adminController.adCredit);
