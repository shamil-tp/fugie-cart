const jwt = require('jsonwebtoken')

const isLoggedIn = (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.redirect('/login')
        }
        console.log(token)
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        console.log(req.user)
        return next()
    } catch (e) {
        console.log(e)
        return res.cookie('token', null).redirect('/login')
    }
}

module.exports = isLoggedIn