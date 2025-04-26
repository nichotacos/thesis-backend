import User from "../models/Users.js";
import bcrypt from "bcrypt";
import { verifyCaptcha } from "../utils/verifyCaptcha.js";
import Level from "../models/Level.js";
import Module from "../models/Module.js";

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

export async function storeUser(req, res) {
    try {
        console.log("Request body:", req.body);
        const { username, userFullName, email, password, captchaToken } = req.body;

        if (!username || !userFullName || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // const isHuman = await verifyCaptcha(captchaToken);

        // if (!isHuman) {
        //     return res.status(400).json({ message: "Verifikasi Captcha gagal!" });
        // }

        const hashedPassword = await bcrypt.hash(password, 10);
        const firstLevel = await Level.findOne({ name: "Bali" });
        const firstModule = await Module.findOne({ level: firstLevel._id, index: 1 });
        const userFirstName = userFullName.split(" ")[0];
        const profilePicture = `https://ui-avatars.com/api/?name=${userFirstName}&background=A60000&color=fff`;

        const newUser = new User({
            username,
            userFullName,
            email,
            hashedPassword,
            currentLearnLevel: firstLevel._id,
            currentModule: firstModule._id,
            profilePicture,
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error storing user", error });
    }
}