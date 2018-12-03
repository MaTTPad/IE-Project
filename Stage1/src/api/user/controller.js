const { success, notFound } = require('../../services/response/')
const User = require('./model').model
const Carmodel = require('../car/model').model
const { sign } = require('../../services/jwt')
const _ = require('lodash')
const catchDuplicateEmail = require("./helpers").catchDuplicateEmail;

const index = (req, res, next) =>
  User.find()
    .then((users) => users.map((user) => user.view()))
    .then(success(res))
    .catch(next)

const show = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.view(true) : null)
    .then(success(res))
    .catch(next)

const showMyReservations = async ({user, res, next}) => {
    // Pobierz wszystkie rezerwacje uzytkownika
    const query = await User.findById(user.id, {  reservations: 1 })  // tylko pole reservation

    // Dla kazdej rezerwacji
    // Znajdz wszystkie samochody ktorych reservations id pasuje do podanego ID - zwraca samochody
    // Wybierz tylko te elementy tablicy rezerwacji które pasuja do danego ID: reservations: {$elemMatch: {_id: reserv}
    // Do wynikow dodaj: model, manufacturer i id
    // Rozwin manufacturer
    const queries = query.reservations.map(reserv =>
        Carmodel.findOne({'reservations._id' : reserv}, {reservations: {$elemMatch: {_id: reserv}}, model: 1, _id: 1})
                .populate( 'name')
                .exec())

    // Jesli chcielibysmy to pogrupowac po modelu, to albo recznie albo zastosowac aggregation framework

    Promise.all(queries)
        .then(results => results.map(result =>
            ({
                _id: result.id,
                model: result.model,
                reservation: result.reservations[0]
            })))
        .then(success(res))
        .catch(next)



}



const showMe = ({ user }, res, next) => {
    res.json(user.view(true))
}

const create = ({ body }, res, next) => {
  User.create(body)
    .then(user => {
      sign(user)
        .then((token) => ({ token, user: user.view(true) }))
        .then(success(res, 201))
    })
    .catch((err) => catchDuplicateEmail(res, err, next))
}

const auth = (req, res, next) => {
    // na typ etapie mamy dostep do uzytkownika w polu req.user
    // Haslo dziala tylko przy logowaniu, wiec dalsza komunikacja jest z tokenem
    // Tworzymy i odsylamy nowy token
    const { user } = req
    sign(user)
        .then((token) => ({token, user: user.view(true)}))
        .then(success(res, 201))
        .catch(next)
}

const update = ({ body , user }, res, next) =>
  User.findById(user.id)
    .then(notFound(res))
    .then((user) => user ? Object.assign(user, body).save() : null)
    .then((user) => user ? user.view(true) : null)
    .then(success(res))
      .catch((err) => catchDuplicateEmail(res, err, next))

const destroy = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.remove() : null)
    .then(success(res, 204))
    .catch(next)

module.exports = {
    create, index, show, update, destroy, showMe, auth, showMyReservations
}

