const express = require('express');
const router = express.Router();
const upload = require('../Middleware/uploadMiddleware');
const { uploadImage } = require('../controller/uploadController');

router.post('/', upload.single('image'), uploadImage);

module.exports = router;