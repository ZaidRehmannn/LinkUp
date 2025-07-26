import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';

// login user
const loginUser = async (req, res) => {
    const { loginIdentifier, password } = req.body;

    try {
        const user = await userModel.findOne({
            $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User doesn't exist!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password!" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                profilePic: user.profilePic,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// register user
const registerUser = async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;

    try {
        const exists = await userModel.findOne({
            $or: [{ email: email }, { username: username }]
        });

        if (exists) {
            if (exists.email === email) {
                return res.status(409).json({ success: false, message: "Email already in use!" });
            }
            else if (exists.username === username) {
                return res.status(409).json({ success: false, message: "Username already in use!" });
            }
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email!" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long!" });
        }
        if (!/\d/.test(password)) {
            return res.status(400).json({ success: false, message: "Password must contain at least one digit!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "Account created succesfully!" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
};

export { loginUser, registerUser };
