import User from "../models/Users.js";

export async function fetchUsers(req, res) {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }
        const totalUser = await User.countDocuments();
        res.status(200).json({
            users: users,
            totalUser: totalUser,
            message: "Users fetched successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
}