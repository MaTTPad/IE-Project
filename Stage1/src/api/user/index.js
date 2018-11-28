// Tu definiujemy routing i go exportujemy

const { Router } = require('express')
const {addUser,showUsers,showUserByID,updateUserByID,destroyUserByID} = require('./controller')

const router = new Router()
// Routing dopasowuje sciezki w kolejnosci deklaracji
// Wiec najpierw deklarujemy ogólnie, a potem szczegolowe, np: /action, /action/:id, /action/:id/filter
// Podobnie, jesli dajemy opcje zadanej wartosci parametru dynamicznego, np. /action/me, /action/:id

// Dobre API ma ustandaryzowane podejście do żądań.
// https://restful-api-design.readthedocs.io/en/latest/methods.html

router.post('/',
    addUser)

router.get('/',
    showUsers)

router.get('/:id',
    showUserByID)

router.put('/:id/',
    updateUserByID)

router.delete('/:id',
    destroyUserByID)
	

module.exports = router
