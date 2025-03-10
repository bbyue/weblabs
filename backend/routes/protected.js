const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ message: 'Это защищенный маршрут. Доступ только для аутентифицированных пользователей.', user: req.user });
});

module.exports = router;