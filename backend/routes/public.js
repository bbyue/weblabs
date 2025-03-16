const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить список событий
 *     description: Возвращает список всех событий
 *     responses:
 *       200:
 *         description: Список событий
 */
router.get('/events', (req, res) => {
    res.json();
});

module.exports = router;