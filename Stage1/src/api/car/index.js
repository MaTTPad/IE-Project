const {token} = require("../../services/passport")
const { Router } = require('express')
const { create, index, show, update, destroy, search} = require('./controller')
const { createReservation, indexReservation, destroyReservation} = require('./controller-reservations')

const router = new Router()

router.post('/',
  create)

router.get('/',
  index)

router.get('/search/',
    search)

router.get('/:id',
  show)

router.put('/:id',
  update)

router.delete('/:id',
  destroy)

// Reservations
router.get('/:id/reservations',
    token({ required: true }),
    indexReservation
)

router.post('/:id/reservations',
    token({ required: true }),
    createReservation
)

router.delete('/:id/reservations/:reservationId',
    token({ required: true }),
    destroyReservation
)

//


module.exports = router
