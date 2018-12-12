const {token} = require("../../services/passport")
const { Router } = require('express')
const { createCar, showAllCars, showCarById, updateCarById, deleteCarById, search} = require('./controller')
const { createReservation, showReservationByCarId, destroyReservation} = require('./controller-reservations')

const router = new Router()

router.post('/',
    token({ required: true, roles: ['admin'] }),
    createCar)

router.get('/',
    token({ required: true, roles: ['admin'] }),
    showAllCars)

router.get('/search/',
    search)

router.get('/:id',
  showCarById)

router.put('/:id',
    token({ required: true, roles: ['admin'] }),
    updateCarById)

router.delete('/:id',
    token({ required: true, roles: ['admin'] }),
    deleteCarById)

// Reservations
router.get('/:id/reservations',
    token({ required: true }),
    showReservationByCarId
)

router.post('/:id/createReservation',
    token({ required: true }),
    createReservation
)

router.delete('/:id/reservations/:reservationId',
    token({ required: true }),
    destroyReservation
)

//


module.exports = router
