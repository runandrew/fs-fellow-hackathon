// API router

// Required packages
const express = require('express');

// Required files
const routerSlack = require('./slack');

// Router creation
const router = express.Router();
module.exports = router;

router.use('/slack', routerSlack);

router.use((req, res, next) => {
  console.log('in /api');
  res.send('In router');
});
