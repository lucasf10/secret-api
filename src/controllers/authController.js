const express = require('express');

const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username } = req.body

        if (await User.exists({ username: username }))
            return res.status(422).send({ error: 'This username is already taken.' });

        const user = await User.create(req.body);
        return res.status(201).send({ user });
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Registration failed' });
    }
});

module.exports = app => app.use('/auth', router);