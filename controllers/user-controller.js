const Schema = require('../lib/db');
const argon2 = require('argon2');

const userSchema = new Schema('users');

const register = async (req, res) => {
    try {
        const { username, name, password } = req.body;

        if (!username || !name || !password) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const user = await userSchema.find(`WHERE username = '${username.toLowerCase()}'`);
        if (user) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const password_hash = await argon2.hash(password)

        const newUser = await userSchema.insert({
            username: username.toLowerCase(),
            name,
            password_hash
        });

        res.status(201).json({ message: 'User created', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAll = async (req, res) => {
    try {
        const users = await userSchema.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getByID = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userSchema.findOne(`WHERE id = '${id}'`);

        if (!user) { return res.status(404).json({ message: 'User not found.' }); }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const { username, name, password } = req.body;

        const user = await userSchema.findOne(`WHERE id = '${id}'`);

        if (!user) { return res.status(404).json({ message: 'User not found.' }); }

        const updatedUser = await userSchema.update(
            {
                username: username || user.username,
                name: name || user.name,
                password_hash: password ? await argon2.hash(password) : user.password_hash
            },
            `id = '${id}'`
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    register,
    getAll,
    getByID,
    updateUser
}