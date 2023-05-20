const express = require('express')
const tagsRouter = express.Router()
const { getAllTags, getPostsByTagName } = require('../db')

tagsRouter.use((req, res, next) => {
  console.log('A request is being made to /tags')

  next() // THIS IS DIFFERENT
})

// curl http://localhost:3000/api/tags/%23sometagname/posts -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2ODQ2MDk5MTZ9.bi71VobKRCZKgh-NZSyYJVgIoJFiny0AsHSYL3ZMwJU'

tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags()

  res.send({
    tags,
  })
})
tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  // read the tagname from the params
  const tagName = req.params.tagName
  try {
    // use our method to get posts by tag name from the db
    const allPosts = await getPostsByTagName(tagName)
    // send out an object to the client { posts: // the posts }
    const posts = allPosts.filter((post) => {
      return post.active && post.author.id === req.user?.id
    })
    res.send({ posts })
  } catch ({ name, message }) {
    // forward the name and message to the error handler
    next({ name, message })
  }
})

module.exports = tagsRouter
