const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'grr youve reacheed the auth endpoint',
  });
});

module.exports = router;
