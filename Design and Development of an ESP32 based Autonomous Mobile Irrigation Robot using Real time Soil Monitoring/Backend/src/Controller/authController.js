import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import OTP from "../Models/OTP.js";
import Robot from "../Models/Robot.js";
import Telemetry from "../Models/Telemetry.js";
import Alert from "../Models/Alert.js";
import Notification from "../Models/Notification.js";
import validator from "validator";
import { sendEmail } from "../Services/emailService.js";
import { emailVerification, resendOTPTemplate } from "../Services/emailTemplates.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Some fields are missing" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        if (!validator.isStrongPassword(password, {
            minLength: 8,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            return res.status(400).json({ message: "Weak password" });
        }

        const existing = await User.findOne({ email });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOTP = await bcrypt.hash(otp, 10);

        await OTP.deleteMany({ email });

        await OTP.create({
            email,
            otp: hashedOTP,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        try {
            if (user?.email) {
                await sendEmail({
                    to: user.email,
                    subject: "Welcome to S.P.I.R.E - Soil Precision & Intelligent Robotic Ecosystem",
                    html: emailVerification(user.name, otp),
                });
            }
            console.log("Email Sent!")
        } catch (error) {
            console.error("Email sending failed:", error.message);
        }

        res.status(201).json({
            success: true,
            message: "Registration successful. OTP sent."
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpData = await OTP.findOne({ email });

        if (!otpData) {
            return res.status(404).json({
                success: false,
                message: "OTP not found"
            });
        }

        if (otpData.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP Expired"
            });
        }

        const matchedOTP = await bcrypt.compare(otp, otpData.otp);

        if (!matchedOTP) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified"
            });
        }

        const updatedUser = await User.findOneAndUpdate({ email },
            {
                isVerified: true
            },
            {
                new: true
            }
        );

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        await OTP.deleteMany({ email });

        res.status(200).json({
            success: true,
            message: "Email Verified",
            user: updatedUser
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified"
            });
        }

        await OTP.deleteMany({ email });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const hashedOTP = await bcrypt.hash(otp, 10);

        await OTP.create({
            email,
            otp: hashedOTP,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        try {
            if (user?.email) {
                await sendEmail({
                    to: user.email,
                    subject: "Welcome to S.P.I.R.E - Soil Precision & Intelligent Robotic Ecosystem",
                    html: resendOTPTemplate(user.name, otp),
                });
            }
            console.log("Email Sent!")
        } catch (error) {
            console.error("Email sending failed:", error.message);
        }

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Please verify your email first"
            });
        }

        const matched = await bcrypt.compare(password, user.password);

        if (!matched) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        user.password = undefined;

        res.status(200).json({
            success: true,
            message: "Login Successful",
            user
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export const getMe = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Old password and new password are required"
            });
        }

        const user = await User.findById(req.user._id).select("+password");

        const matched = await bcrypt.compare(oldPassword, user.password);

        if (!matched) {
            return res.status(400).json({
                success: false,
                message: "Old password incorrect"
            });
        }

        if (!validator.isStrongPassword(newPassword, {
            minLength: 8,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            return res.status(400).json({ message: "Weak password" });
        }

        const samePassword = await bcrypt.compare(
            newPassword,
            user.password
        );

        if (samePassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from the old password."
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password Updated Successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const deleteProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const robots = await Robot.find({ owner: userId }).select("robotId");
        const robotIds = robots.map((robot) => robot.robotId);

        if (robotIds.length > 0) {

            await Telemetry.deleteMany({
                robotId: { $in: robotIds }
            });

            await Alert.deleteMany({
                robotId: { $in: robotIds }
            });

            await Notification.deleteMany({
                robotId: { $in: robotIds }
            });

            await Robot.deleteMany({
                owner: userId
            });
        }

        await OTP.deleteMany({
            email: user.email
        });

        await User.findByIdAndDelete(userId);

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Account Deleted Successfully"
        });

    } catch (error) {
        console.error("Delete profile error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully",
    });
};