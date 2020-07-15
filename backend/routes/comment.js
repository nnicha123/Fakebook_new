const express = require('express')
const router = express.Router()
const passport = require('passport')
const commentController = require('../controllers/comment')

const auth = passport.authenticate("jwt",{session:false})

router.post('/',auth,commentController.addComments)
router.get('/:id',auth,commentController.getCommentsForPost)
router.put('/:id',auth,commentController.updateComment)
router.delete('/:id',auth,commentController.deleteComment)
module.exports = router