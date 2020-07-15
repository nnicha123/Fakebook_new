const db = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Op } = require("sequelize");


const register = async (req, res) => {
    const { username, password, profile_pic,cover_pic, first_name,last_name } = req.body
    const user = await db.user.findOne({ where: { username } }) //short form (username:username)
    if (user) {
        res.status(400).send({ message: 'Username taken' })
    } else {
        const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS))
        const hashedPassword = bcrypt.hashSync(password, salt)
        await db.user.create({ username, password: hashedPassword, first_name,last_name, profile_pic,cover_pic })
        res.status(200).send({ message: "User created" })
    }
}
const login = async (req, res) => {
    const { username, password } = req.body
    const user = await db.user.findOne({ where: { username } })

    if (!user) {
        res.status(400).send({ message: 'username or password not found' })
    }
    else {
        const isSuccess = bcrypt.compareSync(password, user.password)
        if (!isSuccess) {
            res.status(400).send({ message: 'username or password not found' })
        }
        else {
            const payload = {
                id: user.id,
                name: user.name
            }
            const token = jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 })
            res.status(200).send({ token, message: "User found & logged in", username })
        }
    }
}
const getProfileStatus = (relation) => {
    if(relation){
        return relation.status
    }
    return "Not found"
}
const getProfile = async (req, res) => {
    const profileId = Number(req.params.id)
    const myId = Number(req.user.id)
    const targetProfile = await db.user.findOne({ 
        where: { id: profileId } })

    if (!targetProfile) {
        res.status(404).send({ message: "Profile not found" })
    } else {
        const friendRelationShip = await db.friend.findOne({
            where: {
                [Op.or]: [
                    { request_from_id: myId, request_to_id: profileId },
                    { request_from_id: profileId, request_to_id: myId }
                ]
            }
        })
        const status = getProfileStatus(friendRelationShip)
        console.log(status)
        if (status === 'friend') {
            res.status(200).send({targetProfile,status:'Friends'})
        } else if (status === 'pending' && friendRelationShip.request_from_id === myId){
            res.status(200).send({targetProfile,status:'Request sent'})
        }else if (status === 'pending' && friendRelationShip.request_from_id === profileId){
            res.status(200).send({targetProfile,status:"Accept friend"})
        }else if (myId === profileId){
            res.status(200).send({targetProfile,status:"My Profile"})
        }
         else {
            res.status(404).send({message:'Profile not found'})
        }
    }
}
const getSimpleProfile = async(req,res) => {
    const targetUsername = req.params.username
    const targetUser = await db.user.findOne({where:{username:targetUsername}})
    if(targetUser){
        res.status(200).send(targetUser)
    }else{
        res.status(400).send({message:'Cannot find user'})
    }
}
const getOtherUser = async(req,res) => {
    const targetUser = await db.user.findOne({where:{username:req.params.username}})
    res.status(200).send(targetUser)
}
module.exports = {
    login, register, getProfile,getSimpleProfile,getOtherUser
}