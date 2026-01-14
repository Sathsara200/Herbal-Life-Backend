import User from '../models/user.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();

export function registerUser(req, res) {
    const data = req.body;

    bcrypt.password = bcrypt.hashSync(data.password, 10);

    const newUser = new User(data);

    newUser.save().then(() => {
        res.status(201).json({ message: "User registered successfully" });
    }).catch((error) => {
        res.status(500).json({ message: "Error registering user", error: error.message });
    });
}

