// Tu definiujemy funkcje obslugujace routing
const Carmodel = require('./model').model
const Usermodel=require('../user/model').model
//is2018
//is2018ie
const {success, notFound} = require('../../services/response/')

const createCar = ({body}, res, next) =>
    Carmodel.create(body)
        .then((carmodel) => carmodel.view(true))
        .then(success(res, 201))
        .catch(next)



const showCarById = ({ params }, res, next) =>
    Carmodel.findById(params.id)
        .then(notFound(res))
        .then((carmodel) => carmodel ? carmodel.view(true) : null)
        .then(success(res))
        .catch(next)


const showCars = (req, res, next) =>
    Carmodel.find()
        .then((carmodels) => carmodels.map((carmodel) => carmodel.view(true)))
        .then(success(res))
        .catch(next)

/*const showFreeCars= ({ params }, res, next) => {
    success({
        method: 'showFreeCars',
        params: params
    }, res)
}*/

const updateCarById = ({body, params}, res, next) =>
    Carmodel.findById(params.id)
        .then(notFound(res))
        .then((carmodel) => carmodel ? Object.assign(carmodel, body).save() : null)
        .then((carmodel) => carmodel ? carmodel.view(true) : null)
        .then(success(res))
        .catch(next)


const destroyCarById = ({params}, res, next) => {
    success({
        method: 'destroyCarById',
        params: params
    }, res)
}

const createReservationForCarId = ({body, params}, res, next) => {
    //console.log(body.reservations);
    let {pick_up_date, drop_off_date, user_id}=0;
    for (const reservation of body.reservations) {
        //console.log(reservation);
        pick_up_date = reservation.pick_up_date
        drop_off_date = reservation.drop_off_date
        user_id=reservation.user_id
    }

    Carmodel.findByIdAndUpdate(params.id,  { "$push": { "reservations": {"pick_up_date": pick_up_date, "drop_off_date":drop_off_date, "user_id": user_id} }},
        { "new": true, "upsert": true }//,
       // function (err, managerparent) {
         //    if (err) throw err;
           //  console.log(managerparent);
         //}
    )
        .then(notFound(res))
        //.then((carmodel) => carmodel ? Object.assign(carmodel, body).save() : null)
        //.then((carmodel) => carmodel ? carmodel.view(true) : null)
        .then(success(res))

        Usermodel.findByIdAndUpdate(user_id,{ "$push": { "reservedCars": {"car_id": params.id} }},
        { "new": true, "upsert": true }//,
       //  function (err, managerparent) {
         //    if (err) throw err;
           //  console.log(managerparent);
         //}
    )
        .catch(next)


// Carmodel.update({_id: params.id}, {})
};
const showReservationByUserId = ({params}, res, next) => {
    success({
        method: 'showReservationById',
        params: params
    }, res)
};

const destroyReservationByUserId = ({params}, res, next) => {
    success({
        method: 'destroyReservationById',
        params: params
    }, res)
}


module.exports = {
    createCar,
    showCars,
    showCarById,
    updateCarById,
    createReservationForCarId,
    destroyCarById,
    showReservationByUserId,
    destroyReservationByUserId
}