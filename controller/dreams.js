const dreamsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Dream = require('../models/dream')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  } 
  return null
}

dreamsRouter.get('/', async (request, response) => {

  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid'})
  }

  const dreams = await Dream.find({'user': decodedToken.id})
  response.json(dreams.map(dream => dream.toJSON()))
})

dreamsRouter.get('/:id', async (request, response) => {
  const dream = await Dream.findById(request.params.id)
  if (dream) {
    response.json(dream.toJSON())
  } else {
    response.status(404).end()
  }
})

dreamsRouter.post('/', async (request, response) => {

  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid'})
  }
  const user = await User.findById(decodedToken.id)


  const dream = new Dream({
    title: request.body.title,
    content: request.body.content,
    lucid: request.body.lucid,
    user: user._id
  })

  const savedDream = await dream.save()
  user.dreams = user.dreams.concat(savedDream._id)
  response.json(savedDream.toJSON())
  await user.save()
})

dreamsRouter.put('/:id', async (request, response) => {
  const dream = {
    title: request.body.title,
    content: request.body.content
  }
  const updatedDream = await Dream.findByIdAndUpdate(request.params.id, dream, { new: true})
  response.json(updatedDream.toJSON())
})

dreamsRouter.delete('/:id', async (request, response) => {
  await Dream.findByIdAndRemove(request.params.id)

  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid'})
  }
  const user = await User.findById(decodedToken.id)
  user.dreams = user.dreams.filter(dream => dream.toString() !== request.params.id)
  await user.save()
  response.status(204).end()
})

module.exports = dreamsRouter