require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const userRoute = require('./routes/user')
const postRoute = require('./routes/post')
const friendRoute = require('./routes/friend')
const commentRoute = require('./routes/comment')
const db = require('./models')

require('./config/passport/passport')

app.use(cors())
app.use(bodyParser.json()) //so can use as json
app.use(bodyParser.urlencoded({ extended: false })) //cannot use in nest form (extended:false)
app.use('/users',userRoute)
app.use('/posts',postRoute)
app.use('/friends',friendRoute)
app.use('/comments',commentRoute)

db.sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}`))
})

