const { v4: uuidv4 } = require('uuid');
const { createShortUrl, findByCode , findAndUpdate} = require('../models/shortUrlModel');

function generateUUIDShortCode() {
  return uuidv4().split('-')[0];  
}

async function shortenUrl(req, res) {
  const { url, customCode } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing "url" field' });
  }

  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const code = customCode || generateUUIDShortCode();

  try {
    const row = await createShortUrl(code, url);

    const host = req.get('host'); 
    const shortUrlNoScheme = `${host}/${row.code}`;
    const fullShortUrl = `${req.protocol}://${host}/${row.code}`;

    return res.status(201).json({
      shortUrl: shortUrlNoScheme,   
      fullShortUrl,                 
      code: row.code,
      originalUrl: row.original_url,
      createdAt: row.created_at,
    });
  } catch (err) {
    console.error('Error creating short URL:', err);

    if (err.code === '23505') {
      return res.status(409).json({ error: 'This shortcode is already in use' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function redirectToOriginal(req, res) {
  const { code } = req.params;

  try {
    const row = await findByCode(code);

    if (!row) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    await findAndUpdate(code);
    return res.redirect(302, row.original_url);
  } catch (err) {
    console.error('Error fetching short URL:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getAllUrls(req, res){
  try {
    const urls = await UrlModel.getAllUrls();
    return res.status(200).json({
      count: urls.length,
      data: urls,
    });
  } catch (err) {
    console.error('Error in getAllUrls:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  shortenUrl,
  redirectToOriginal,
  getAllUrls
};
