/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     description: Регистрирует нового пользователя
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - gender
 *               - birthDate
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Иван
 *               lastName:
 *                 type: string
 *                 example: Иванов
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: securePassword123
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: male
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Успешная регистрация
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: |
 *           Возможные ошибки:
 *           - Не все обязательные поля указаны
 *           - Пользователь с таким email уже существует
 *           - Дата рождения не может быть в будущем
 *           - Имя пользователя не должно содержать цифры
 *       500:
 *         description: Ошибка сервера при регистрации
 */
export {};
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     description: Авторизует пользователя и возвращает JWT токен
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Авторизация успешна
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Успешный вход
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Невалидные данные
 *       401:
 *         description: Неверный email или пароль
 *       500:
 *         description: Ошибка сервера при авторизации
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         firstName:
 *           type: string
 *           example: Иван
 *         lastName:
 *           type: string
 *           example: Иванов
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: male
 *         birthDate:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         createdAt:
 *           type: string
 *           format: date-time
 */ 
