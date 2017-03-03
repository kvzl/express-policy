const _ = require('lodash')
const express = require('express')
const app = new express()

const router = express.Router()

const policy = require('../lib')

const policies = {
  'auth': (req, res, next) => {
    console.log('====> auth')

    if (req.user) {
      next()
    } else {
      res.redirect('/login')
    }
  },

  'user': (req, res, next) => {
    console.log('====> user')

    if (req.user.role === 'user') {
      next()
    } else {
      next({ message: 'Not allowed.' })
    }
  },

  'admin': (req, res, next) => {
    console.log('====> admin')

    if (req.user.role === 'admin') {
      next()
    } else {
      next({ message: 'Not Not allowed.' })
    }
  }
}

app.use((req, res, next) => {

  const { dev } = req.headers

  if (dev === 'admin') {
    req.user = { role: 'admin' }
  } else if (dev === 'user') {
    req.user = { role: 'user' }
  }

  next()

})

router.get('/api/users', (req, res, next) => {
  res.status(200).json({ message: '/api/users' })
})
router.get('/api/users/:id/name', (req, res, next) => {
  res.status(200).json({ message: '/api/users/:id/name' })
})
router.post('/api/users', (req, res, next) => {
  res.status(200).json({ message: 'ok' })
})
router.patch('/api/users', (req, res, next) => {
  res.status(200).json({ message: 'ok' })
})


app.use(policy({
  config: require('./config'),
  policies,
}))

app.use(router)

app.use((err, req, res, next) => {
  console.log(err)
  res.json(err)
})

app.listen(3001).listen(3001)
