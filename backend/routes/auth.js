const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User } = require('../models/user');
const { LoginHistory } = require('../models/loginHistory');
const { JWT_SECRET, EMAIL_ADDRESS, EMAIL_PASSWORD } = process.env;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD, 
    },
});
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при регистрации пользователя', error });
    }
});
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: EMAIL_ADDRESS,
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const ipAddress = req.ip; 
    const userAgent = req.headers['user-agent'];

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Пользователь с таким email не найден' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Неверный пароль' });
        }

        const lastLogins = await LoginHistory.findAll({
            where: { userId: user.id },
            order: [['createdAt', 'DESC']],
            limit: 5,
        });

        const isNewDevice = !lastLogins.some(
            (login) => login.ipAddress === ipAddress && login.userAgent === userAgent
        );

        if (isNewDevice) {
            sendEmail(
                user.email, 
                'Новый вход в аккаунт',
                `Обнаружен новый вход в ваш аккаунт с IP: ${ipAddress} и User-Agent: ${userAgent}.`
            );
        }
        await LoginHistory.create({
            userId: user.id,
            ipAddress,
            userAgent,
        });

        const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Авторизация успешна', token });
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        res.status(500).json({ message: 'Ошибка при авторизации', error });
    }
});
module.exports = router;