const express = require('express');
const { shortenUrl, redirectToOriginal, getAllUrl, getUrlDetail, deleteUrl } = require('../controllers/urlController');

const router = express.Router();

// Create short URL
router.post('/api/links', shortenUrl);

//getAllUrls
router.get('/api/links', getAllUrl);

//getURLdata
router.get('/api/links/:code',getUrlDetail);

// Redirect (/<shortcode>)
router.get('/:code', redirectToOriginal);

router.delete('/api/links/:code', deleteUrl);

module.exports = router;
