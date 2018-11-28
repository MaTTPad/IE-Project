// Plik centralny API - tu importujemy enpointy (index.js) z poszczegolnych katalogow
const {Router} = require('express')
const car = require('./car')
const user = require('./user')

// Routing
const router = new Router()
router.use('/car', car)
router.use('/user', user)
// Inny routing idzie tutaj

// 404 Error handler
router.use((req, res, next) =>  res.status(404).send({error: 'Routing not found'}))

// 500 Error handler
// Dobra aplikacja NIGDY tego nie uzyje
router.use((err, req, res, next) =>  {
    console.error(err.stack)
    res.status(500).send({error: 'Server error'})
})


//console.log(typeof routerCar)
//module.exports =  {routerCar , routerUser}


module.exports = router;

//module.exports= routerCar
