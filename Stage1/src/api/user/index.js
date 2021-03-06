const { Router } = require('express')
const { token, password } = require('../../services/passport')
const {showAllUsers, showMe, showUserById, createUser, updateUserById, deleteUserById, auth, showMyReservations, sendMail} = require('./controller')
const router = new Router()


router.get('/',
  token({ required: true, roles: ['admin'] }),
  showAllUsers)

router.get('/me',
  token({ required: true, userGroups: ['onlineUser'] }),
  showMe)

router.get('/me/reservations',
  token({required: true, userGroups: ['onlineUser'] }),
    showMyReservations)

router.get('/:id',
  token({ required: true, roles: ['admin'] }),
  showUserById)

router.post('/',
  createUser)

router.post('/sendMail',
    sendMail)

router.post('/auth',
    password(),
    auth)

router.put('/',
  token({ required: true }),
  updateUserById)

router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  deleteUserById)

module.exports = router

