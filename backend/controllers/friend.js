const db = require('../models')
const { Op } = require('sequelize')

const orLogic = (myId, targetId) => {
    return {
        [Op.or]: [{ request_from_id: myId, request_to_id: targetId }, { request_from_id: targetId, request_to_id: myId },],
    }
}
const getRelationship = async (req, res) => {
    const targetId = Number(req.params.id)
    const myId = Number(req.user.id)
    const relationship = await db.friend.findOne({ where: orLogic(myId, targetId) })
    if (relationship) {
        res.status(200).send(relationship)
    } else {
        res.status(400).send({ message: 'Relationship not found' })
    }
}
const sendRequestFriend = async (req, res) => {
    const targetId = Number(req.params.id)
    const myId = Number(req.user.id)
    const friendRelationship = await db.friend.findOne({ where: orLogic(myId, targetId) })

    if (!friendRelationship && targetId !== myId) {
        const newFriend = await db.friend.create({
            status: 'pending',
            request_to_id: targetId,
            request_from_id: myId
        })
        res.status(200).send(newFriend)
    } else res.status(400).send({ message: 'Already have relations' })
}

const denyFriendRequest = async (req, res) => {
    const targetId = Number(req.params.id)
    const myId = Number(req.user.id)

    const friendRelationship = await db.friend.findOne({ where: { [Op.and]: [{ status: 'pending' }, orLogic(myId, targetId)] } })
    if (friendRelationship) {
        await friendRelationship.destroy()
        res.status(200).send({ message: 'deleted relationship' })
    } else res.status(400).send({ message: 'Something went wrong' })
}
const acceptFriendRequest = async (req, res) => {
    const targetId = Number(req.params.id)
    const myId = Number(req.user.id)

    const friendRelationship = await db.friend.findOne({ where: { [Op.and]: [{ status: 'pending' }, orLogic(myId, targetId)] } })
    if (friendRelationship) {
        await friendRelationship.update({ status: 'friend' })
        res.status(200).send({ message: 'You are now friends' })
    } else res.status(400).send({ message: 'Something went wrong' })
}

const deleteFriend = async (req, res) => {
    const targetId = Number(req.params.id)
    const myId = Number(req.user.id)

    const friendRelationship = await db.friend.findOne({ where: { [Op.and]: [{ status: 'friend' }, orLogic(myId, targetId)] } })
    if (friendRelationship) {
        await friendRelationship.destroy()
        res.status(200).send({ message: 'Deleted friend' })
    } else res.status(400).send({ message: 'Something went wrong' })
}

const countFriends = async (req, res) => {
    const myId = Number(req.params.id)
    const friends = await db.friend.findAll({ where: { [Op.and]: [{ status: 'friend' }, { [Op.or]: [{ request_from_id: myId }, { request_to_id: myId }] }] } })
    res.status(200).send(friends)
}


module.exports = {
    sendRequestFriend, denyFriendRequest, acceptFriendRequest, deleteFriend, getRelationship, countFriends
}