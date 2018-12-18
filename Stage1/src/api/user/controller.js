const { success, notFound } = require('../../services/response/')
const { sendmail } = require('../../services/emails/')

const User = require('./model').model
const Carmodel = require('../car/model').model
const { sign } = require('../../services/jwt')
const _ = require('lodash')
const catchDuplicateEmail = require("./helpers").catchDuplicateEmail;

const showAllUsers = (req, res, next) =>
  User.find()
    .then((users) => users.map((user) => user.view()))
    .then(success(res))
    .catch(next)

const showUserById = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.view(true) : null)
    .then(success(res))
    .catch(next)

const showMyReservations = async ({user, res, next}) => {
    const query = await User.findById(user.id, {  reservations: 1 })  // tylko pole reservation


    const queries = query.reservations.map(reserv =>
        Carmodel.findOne({'reservations._id' : reserv}, {reservations: {$elemMatch: {_id: reserv}}, model: 1, _id: 1})
                .populate( 'name')
                .exec())


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

const createUser = ({ body }, res, next) => {
  User.create(body)
    .then(user => {
      sign(user)
        .then((token) => ({ token, user: user.view(true) }))
        .then(success(res, 201))
    })
    .catch((err) => catchDuplicateEmail(res, err, next))
}

const auth = (req, res, next) => {
    const { user } = req
    sign(user)
        .then((token) => ({token, user: user.view(true)}))
        .then(success(res, 201))
        .catch(next)
}

const updateUserById = ({ body , user }, res, next) =>
  User.findById(user.id)
    .then(notFound(res))
    .then((user) => user ? Object.assign(user, body).save() : null)
    .then((user) => user ? user.view(true) : null)
    .then(success(res))
      .catch((err) => catchDuplicateEmail(res, err, next))

const deleteUserById = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.remove() : null)
    .then(success(res, 204))
    .catch(next)

const sendMail = ({ body }, res, next) => {
   sendmail(body.to, body.subject, body.content)
        // .then(user => {
        //     sign(user)
        //         .then((token) => ({ token, user: user.view(true) }))
        //         .then(success(res, 201))
        // })
       //.then(success(res, 201))
      // .catch((err) => catchDuplicateEmail(res, err, next))
}


module.exports = {
    createUser, showAllUsers, showUserById, updateUserById, deleteUserById, showMe, auth, showMyReservations, sendMail
}

