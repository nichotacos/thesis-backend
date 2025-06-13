import bcrypt from 'bcrypt';
import User from '../models/Users.js';
import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken.js';

const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRATION }
    );
}

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );
}

export async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (username === '' || password === '') {
            return res.status(400).json({
                message: 'Masukkan Username dan Password!',
            });
        }

        const user = await User.findOne({ username }).populate('currentLearnLevel').
            populate({ path: 'currentModule', populate: { path: 'level', model: 'Level' } }).
            populate('achievements.achievement').
            populate({ path: 'completedModules.module', populate: { path: 'level', model: 'Level' } });

        if (!user) {
            return res.status(404).json({
                message: 'Pengguna tidak ditemukan!',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Username atau kata sandi salah!',
            });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        const newRefreshToken = new RefreshToken({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiration
        });

        await newRefreshToken.save();

        res.status(200).json({
            accessToken,
            refreshToken,
            user,
            message: 'Login successful!',
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error!',
            error: error.message,
        })
    }
};

export async function refreshAccessToken(req, res) {
    const { refreshToken } = req.body;

    try {
        if (!refreshToken) {
            return res.status(400).json({
                message: 'Refresh token is required!',
            });
        }

        const foundToken = await RefreshToken.findOne({ token: refreshToken });
        if (!foundToken) {
            return res.status(403).json({
                message: 'Invalid refresh token!',
            });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
        const newAccessToken = generateAccessToken(decoded.userId);

        res.status(200).json({
            accessToken: newAccessToken,
            message: 'Access token refreshed successfully!',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error!',
            error: error.message,
        });
    }
}

export async function logout(req, res) {
    const { refreshToken } = req.body;

    try {
        if (!refreshToken) {
            return res.status(400).json({
                message: 'Refresh token is required!',
            });
        }

        await RefreshToken.findOneAndDelete({ token: refreshToken });

        res.status(200).json({
            message: 'Logged out successfully!',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error!',
            error: error.message,
        });
    }
}