const User = require('../models/User');

const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    const options = {
        expires: new Date(
            Date.now() + (process.env.COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: 'lax'
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            user: {
                phone: user.phone,
                name: user.name
            },
            needsName: !user.name   // ⭐ THIS IS THE KEY
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

exports.logout = (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    return res.redirect('/auth/login');
};


exports.getLoginPage = (req, res) => {
    res.render('login');
};

exports.saveName = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Name is required'
    });
  }

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  req.user.name = name;
  await req.user.save();

  res.json({
    success: true,
    name: req.user.name
  });
};




