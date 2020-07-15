const db = require('../models')

const addComments = async (req,res) => {
    const {message} = req.body
    const newComment = await db.comment.create({message,post_id:req.post.id}) 
    res.status(201).send(newComment)
}
const getCommentsForPost = async(req,res) => {
    const targetPostId = req.params.id
    const postComments = await db.comment.findAll({where:{post_id:targetPostId}})
    res.status(200).send(postComments) 
}
const updateComment = async(req,res) => {
    const targetCommentId = req.params.id
    const findAndUpdate = await db.comment.findOne({where:{id:targetCommentId,user_id:req.user.id}})
    const {message} = req.body
    if(findAndUpdate) {
        findAndUpdate.update({message})
        res.status(201).send({message:'Comment updated'})
    }else{
        res.status(400).send({message:'Cannot find comment'})
    }
}
const deleteComment = async(req,res) => {
    const targetId = req.params.id
    const targetComment = await db.comment.findOne({where:{id:targetId,user_id:req.user.id}})
    if(targetComment) {
        await targetComment.destroy()
        res.status(204).send()
    }else res.status(404).send({message:'Cannot delete comment'})
}
module.exports = {
    addComments,getCommentsForPost,updateComment,deleteComment
}