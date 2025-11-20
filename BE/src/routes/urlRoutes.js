const express = require('express');
const { shortenUrl, redirectToOriginal, getAllUrls } = require('../controllers/urlController');

const router = express.Router();

// Create short URL
router.post('/shorten', shortenUrl);

//getAllUrls
router.get('/getAllUrls', getAllUrls);

// Redirect (/<shortcode>)
router.get('/:code', redirectToOriginal);

module.exports = router;
