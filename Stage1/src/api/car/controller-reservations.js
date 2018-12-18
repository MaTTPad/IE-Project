const { success, notFound } = require('../../services/response/')
const Carmodel = require('./model').model
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../user/model').model
const { sendmail } = require('../../services/emails/')

const createReservation = async (req, res, next) => {

    const {pick_up_date, drop_off_date} = req.body
    const user = req.user
    const {id} = req.params

    let car = await Carmodel.findById(id).exec()
    if(car === null) return notFound(res)(car)
    const reservationId = ObjectId()




    const newPickUpDate = new Date(pick_up_date)
    const newDropOffDate = new Date(drop_off_date)
    let numberOfHoursCeil =(newDropOffDate - newPickUpDate)/(1000*3600);
    const total_price = Math.ceil(numberOfHoursCeil) * car.price_per_hour;

    for (var i = 0; i < car.reservations.length; i++) {
        var tempCar = car.reservations[i];
        if(tempCar.pick_up_date.getTime()<=newPickUpDate.getTime() && tempCar.drop_off_date.getTime()>=newDropOffDate.getTime())
        {
            return res.status(400).json({errors: ['This car is already rented. Choose another date.']});
        }
        else if(tempCar.pick_up_date.getTime()<=newPickUpDate.getTime() && tempCar.drop_off_date.getTime()>=newPickUpDate.getTime())
        {
            return res.status(400).json({errors: ['This car is already rented. Choose another date.']});
        }
        else if(tempCar.pick_up_date.getTime()>=newPickUpDate.getTime() && tempCar.pick_up_date.getTime()>=newDropOffDate.getTime())
        {
            return res.status(400).json({errors: ['This car is already rented. Choose another date.']});
        }
        else if(tempCar.pick_up_date.getTime()>=newPickUpDate.getTime() && tempCar.drop_off_date.getTime()>=newDropOffDate.getTime())
        {
            return res.status(400).json({errors: ['This car is already rented. Choose another date.']});
        }
    }

    if(newDropOffDate.getTime() <= newPickUpDate.getTime())
        return res.status(400).json({errors: ['The end date must be greater than or equal to the rental date.']});

    const now = new Date()
    if(newPickUpDate.getTime() <= now.getTime())
        return res.status(400).json({errors: ['It is not possible to rent a car from the past']});

    try {
        car.reservations.push({
            _id: reservationId,
            user: user._id,
            pick_up_date:pick_up_date,
            drop_off_date:drop_off_date,
            total_price:total_price
        })
    } catch (e) {
        return res.status(400).end();
    }

    user.reservations.push(reservationId)

    {
        await car.save()
        await user.save()

        success(res)(car.reservations.map(r => r.viewBy(user)))
    }

    mailContent="Witamy! <br><br> Właśnie dokonałeś rezerwacji w naszej wypożyczalni. Dane Twojej rezerwacji: <br><br>" +
        "<b>Numer rezerwacji:</b> "+reservationId+"<br><b>Marka:</b> "+car.manufacturer +"<br><b>Model:</b> "+car.model+
        "<br><b>Data rozpoczęcia rezerwacji:</b> "+pick_up_date+ "<br><b>Data zakończenia rezerwacji: </b>"+drop_off_date+
        "<br><b>Całkowity koszt rezerwacji:</b> "+total_price+" zł"+
        "<br><br><b>Życzymy szerokiej drogi!</b> <br><br> <i>Zespół MatWojCarRent.</i>"
    sendmail(user.email,"Rezerwacja numer "+reservationId,mailContent)
}

const showReservationByCarId = (req, res, next) => {
    Carmodel.findById(req.params.id)
        .populate('reservations.user', '_id name email')
        .then(notFound(res))
        .then((carmodel) => carmodel ? carmodel.reservations.map(r => r.viewBy(req.user)) : null)
        .then(success(res))
        .catch(next)
}

const destroyReservation = async (req, res, next) => {
    const {id, reservationId} = req.params


    let car = await Carmodel.findOne({_id : id}, {reservations: {$elemMatch: {_id: reservationId}}})
    if(car === null || car.reservations.length === 0){
        return notFound(res)(null)
    }

    const userId = car.reservations[0].user

    const carPromise = Carmodel.findByIdAndUpdate(id, { $pull: { reservations: { _id: reservationId } }}, {new: true} ).exec() // new - odpowiedzialny za zwrot dokumentu "Po" akcji, domyslnie zwraca sprzed akcji
    const userPromise = User.findOneAndUpdate({_id: userId}, { $pull: { reservations: reservationId} }, {new: true}).exec()      // To tez jest przez ID ale pokazuje jak mozna to zrobic pelnym zapytaniem

    {
        const results = await Promise.all([
            carPromise,
            userPromise
        ]);

        try {   // Tutaj try sluzy do obslugi rejection z Promise
            const reservations = results[0].reservations.map(r => r.viewBy(req.user))
            success(res)(reservations)
        } catch (e) {
            res.status(400).end()
        }
    }

}

module.exports = {
    createReservation, showReservationByCarId, destroyReservation
}
