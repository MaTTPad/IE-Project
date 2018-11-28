// Tu definiujemy routing i go exportujemy

const { Router } = require('express')
const { createCar,showCars,updateCarById, showCarById ,destroyCarById,createReservationForCarId,showReservationByUserId,destroyReservationByUserId} = require('./controller')

const router = new Router()
// Routing dopasowuje sciezki w kolejnosci deklaracji
// Wiec najpierw deklarujemy ogólnie, a potem szczegolowe, np: /action, /action/:id, /action/:id/filter
// Podobnie, jesli dajemy opcje zadanej wartosci parametru dynamicznego, np. /action/me, /action/:id

// Dobre API ma ustandaryzowane podejście do żądań.
// https://restful-api-design.readthedocs.io/en/latest/methods.html
router.post('/',
    createCar)

router.get('/',
    showCars)

//router.get('/freecars',
 //   showFreeCars)

router.get('/:id',
    showCarById)

router.put('/:id',
    updateCarById)

router.delete('/:id',
    destroyCarById)

router.put('/:id/reservation',
    createReservationForCarId)

router.get('/:id/reservation/:userID',
    showReservationByUserId)

router.delete('/:id/reservation/:userID',
    destroyReservationByUserId)

	

module.exports = router
