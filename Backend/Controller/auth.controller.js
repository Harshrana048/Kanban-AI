// external Module 
const jwt = require('jsonwebtoken');


// local Module
const User = require('../Model/User.model')


const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

exports.register = async (req, res) => {
    try {
        const { name, email, password, confirmpassword } = req.body;
        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists',
            });
        }

        const user = await User.create({ name, email, password });
        const token = signToken(user._id);
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });
        res.status(201).json({
            success: true,
            token,
            user: user.toSafeObject(),
        });


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({

            success: false,
            message: 'Server error. Please try again later.',
        });

    }

}

exports.getlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // include password because schema likely sets password as select:false
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
        const token = signToken(user._id);
        // update last login timestamp
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });
        res.status(201).json({
            success: true,
            token,
            user: user.toSafeObject(),
        });

    } catch (error) {

        res.status(500).json({ message: error.message });
    }
}