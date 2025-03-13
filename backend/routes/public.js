const express = require('express');
const router = express.Router();

router.get('/events', (req, res) => {
    res.json();
});

module.exports = router;