import User from '../models/user.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Order from '../models/order.js';

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

export async function getAdminDashboardStats(req, res) {
  if (!isItAdmin(req)) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const completedOrders = await Order.countDocuments({ status: "Completed" });
    const cancelledOrders = await Order.countDocuments({ status: "Cancelled" });

    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      users: {
        totalUsers,
        totalCustomers,
        totalAdmins,
      },
      orders: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
      },
      payments: {
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
}

export async function updateUser(req, res) {
	if (req.user == null) {
		return res.status(403).json({ error: "Unauthorized" });
	}

	const email = req.params.email;
	const data = req.body;

	// Only allow users to update their own profile OR an admin to update any profile
	if (req.user.email !== email && !isItAdmin(req)) {
		return res.status(403).json({ error: "Unauthorized to update this user" });
	}

	try {
		// Prevent updating sensitive fields directly through this endpoint
		// Role and Block status should be handled by specific admin endpoints
		delete data.role;
		delete data.isBlocked;
		delete data.email; // Email is unique and shouldn't be changed easily

		if (data.password) {
			data.password = bcrypt.hashSync(data.password, 10);
		}

		const updatedUser = await User.findOneAndUpdate(
			{ email: email },
			{ $set: data },
			{ new: true }
		);

		if (!updatedUser) {
			return res.status(404).json({ error: "User not found" });
		}

		// Generate a new token with updated information
		const token = jwt.sign(
			{
				firstName: updatedUser.firstName,
				lastName: updatedUser.lastName,
				email: updatedUser.email,
				role: updatedUser.role,
				address: updatedUser.address,
				country: updatedUser.country,
				profilePicture: updatedUser.profilePicture,
				phone: updatedUser.phone,
				emailVerified: updatedUser.emailVerified,
			},
			process.env.JWT_SECRET
		);

		res.json({ 
			message: "User updated successfully", 
			user: updatedUser,
			token: token 
		});
	} catch (e) {
		res.status(500).json({ error: "Failed to update user", details: e.message });
	}
}
