// Required packages
const express = require('express');

// Router creation
const router = express.Router();
module.exports = router;

// GET - /api/slack/test
router.get('/test', (req, res, next) => {
  console.log('In slack route');
  res.send('in slack');
});
