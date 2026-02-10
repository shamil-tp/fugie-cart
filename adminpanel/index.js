require('dotenv').config()

const express = require('express')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')




app.use(cookieParser())
app.use(express.urlencoded())
app.use(express.json())
app.use(express.static('public'))


const auth = require('./routes/authRoutes')
const home = require('./routes/dashboardRoutes')
const isLoggedin = require('./middlewares/isLoggedIn')

app.use('/',auth)
app.use('/',isLoggedin,home)

app.use((req, res) => {
    return res.send('404')
})

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    connectDB()
});
