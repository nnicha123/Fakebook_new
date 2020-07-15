const express = require("express")
const router = express.Router()
const userController = require('../controllers/user')
const passport = require('passport')

const authentication = passport.authenticate("jwt", { session: false })

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/profileId/:id', authentication, userController.getProfile)
router.get('/profile/:username',authentication,userController.getSimpleProfile)
router.get('/allusers/:username',userController.getOtherUser)

module.exports = router