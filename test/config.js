module.exports = {

  '/api/login': true,

  '/api/users': {
    '*': 'auth',
    get: ['auth', 'user'],
    post: ['auth', 'user'],
  },

  '/api/users/:id/name': {
    '*': 'auth',
    get: ['auth', 'admin'],
  },
  
}
