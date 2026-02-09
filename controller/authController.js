const User = require('../models/User');

const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    const options = {
        expires: new Date(
            Date.now() + (process.env.COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        token
    });
};

exports.login = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Please enter your phone number"
            });
        }

        let user = await User.findOne({ phone });

        if (!user) {
            // Register user if not exists (implicit registration as per common OTP flows, or strict login?)
            // Assuming strict login based on "register" usually being separate, but for OTP often combined.
            // Let's create a new user if one doesn't exist, or just return error?
            // User asked for "complete authentication", usually implies signup.
            // Let's create a partial user or just wait for verify to create?
            // Actually, best to just find or create here.
            user = await User.create({ phone });
        }

        // Generate 4 digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        user.otp = otp;
        await user.save();

        // In a real app, send SMS here.
        // For development, we return it in the response.
        
        res.status(200).json({
            success: true,
            message: `OTP sent to ${phone}`,
            otp: otp // TEMPORARY: for testing purposes
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: "Please enter phone and OTP"
            });
        }

        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Clear OTP after successful verification
        user.otp = undefined;
        await user.save();

        sendToken(user, 200, res);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.logout = async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

exports.getLoginPage = (req, res) => {
    res.render('login');
};
