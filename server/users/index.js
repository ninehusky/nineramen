const express = require('express');

const router = express.Router();

const errorHandler = require('./errors');

router.get('/', (req, res, next) => {
  res.json({
    message: 'hello, world!',
  });
});

router.post('/', (req, res, next) => {

});

router.patch('/', (req, res, next) => {

});

router.delete('/', (req, res, next) => {

});

router.use(errorHandler.notFound);
router.use(errorHandler.handleError);

module.exports = router;
