const express = require('express');
const { shortenUrl, redirectToOriginal, getAllUrl } = require('../controllers/urlController');

const router = express.Router();

// Create short URL
router.post('/shorten', shortenUrl);

//getAllUrls
router.get('/getAllUrls', getAllUrl);

// Redirect (/<shortcode>)
router.get('/:code', redirectToOriginal);

module.exports = router;
