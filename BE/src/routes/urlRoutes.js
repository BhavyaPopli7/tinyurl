const express = require('express');
const { shortenUrl, redirectToOriginal } = require('../controllers/urlController');

const router = express.Router();

// Create short URL
router.post('/shorten', shortenUrl);

// Redirect (/<shortcode>)
router.get('/:code', redirectToOriginal);

module.exports = router;
