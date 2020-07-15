const express = require('express')
const router = express.Router()
const postController = require('../controllers/post')
const passport = require('passport')

const authentication = passport.authenticate("jwt",{session:false})

// router.get('/:id/:user_id')
router.post('/',authentication,postController.createPost)
router.get('/',authentication,postController.getAllPosts)
router.put('/:id',authentication,postController.editPost)
router.delete('/:id',authentication,postController.deletePost)

module.exports = router