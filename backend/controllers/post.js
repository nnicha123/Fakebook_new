const db = require('../models')

const getAllPosts = async (req, res) => {
    const posts = await db.post.findAll()
    res.status(200).send(posts)
}
const createPost = async (req, res) => {
    const { text, picture } = req.body
    const post = await db.post.create({ text, picture, user_id: req.user.id })
    res.status(201).send(post)
}
const editPost = async (req, res) => {
    const targetId = req.params.id
    const {text,picture} = req.body
    const targetPost = await db.post.findOne({where:{id:targetId,user_id:req.user.id}})
    if(!targetPost) res.status(404).send({message:'Post not found'})
    else {
        await targetPost.update({text,picture})
        res.status(200).send({message:'Post has been updated'})
    }
}
const deletePost = async (req, res) => {
    const targetId = req.params.id
    const targetPost = await db.post.findOne({ where: { id: targetId, user_id: req.user.id } })
    if (!targetPost){
        res.status(404).send({message:'Post not found'})
    }
    else{
        await targetPost.destroy()
        res.status(200).send({ message: 'Post deleted' })
    }
}
module.exports = {
    getAllPosts, createPost, editPost, deletePost
}