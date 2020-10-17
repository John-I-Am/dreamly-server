const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

usersRouter.post('/', async (req, res) => {

  const passwordHash = await bcrypt.hash(req.body.password, 10)

  const user = new User({
    username: req.body.username,
    passwordHash,
  })

  const savedUser = await user.save()
  res.json(savedUser)
})

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users.map(user => user.toJSON()))
})

module.exports = usersRouter