import User from '../models/user.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();

export function registerUser(req, res) {
    const data = req.body;

    data.password = bcrypt.hashSync(data.password, 10);

    const newUser = new User(data);

    newUser.save().then(() => {
        res.status(201).json({ message: "User registered successfully" });
    }).catch((error) => {
        res.status(500).json({ message: "Error registering user", error: error.message });
    });
}

export function loginUser(req, res) {
    const data = req.body;

    User.findOne({
        email: data.email,
    }).then((user) => {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }else {
            if (user.isBlocked) {
                res.status(403).json({ error: "User is blocked" });
                return;
            }

            const isPasswordCorrect = bcrypt.compareSync(data.password, user.password);

            if (isPasswordCorrect){
                const token = jwt.sign(
                    {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role,
                        profilePicture: user.profilePicture,
                        phone: user.phone,
                        emailVerified: user.emailVerified, 
                    },
                    process.env.JWT_SECRET
                );
                res.status(200).json({ message: "Login successful", token: token, user: user });
            }else {
                res.status(401).json({ message: "Login failed" });
            }
            
        }
    });
}

export function isItAdmin(req) {
	let isAdmin = false;

	if (req.user != null) {
		if (req.user.role == "admin") {
			isAdmin = true;
		}
	}

	return isAdmin;
}

export function isItCustomer(req) {
	let isCustomer = false;

	if (req.user != null) {
		if (req.user.role == "customer") {
			isCustomer = true;
		}
	}

	return isCustomer;
}

export async function getAllUsers(req, res) {
	if (isItAdmin(req)) {
		try {
			const users = await User.find();
			res.json(users);
		} catch (e) {
			res.status(500).json({ error: "Failed to get users" });
		}
	} else {
		res.status(403).json({ error: "Unauthorized" });
	}
}

export async function blockOrUnblockUser(req, res) {
	const email = req.params.email;
	if (isItAdmin(req)) {
		try {
			const user = await User.findOne({
				email: email,
			});

			if (user == null) {
				res.status(404).json({ error: "User not found" });
				return;
			}

			const isBlocked = !user.isBlocked;

			await User.updateOne(
				{
					email: email,
				},
				{
					isBlocked: isBlocked,
				}
			);

			res.json({ message: "User blocked/unblocked successfully" });
		} catch (e) {
			res.status(500).json({ error: "Failed to get user" });
		}
	} else {
		res.status(403).json({ error: "Unauthorized" });
	}
}

export function getUser(req, res) {
	if (req.user != null) {
		res.json(req.user);
	} else {
		res.status(403).json({ error: "Unauthorized" });
	}
}