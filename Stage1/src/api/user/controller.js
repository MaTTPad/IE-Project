// Tu definiujemy funkcje obslugujace routing
const Usermodel = require('./model').model
const { success, notFound } = require('../../services/response/')


const addUser = ({ body }, res, next) =>
    Usermodel.create(body)
    .then((usermodel) => usermodel.view(true))
    .then(success(res, 201))
    .catch(next)


const showUsers = (req, res, next) =>
    Usermodel.find()
    .then((usermodels) => usermodels.map((usermodel) => usermodel.view(true)))
    .then(success(res))
    .catch(next)

const showUserByID = ({ params }, res, next) =>
    Usermodel.findById(params.id)
        .then(notFound(res))
        .then((usermodel) => usermodel ? usermodel.view(true) : null)
        .then(success(res))
        .catch(next)


const updateUserByID = ({ body , params }, res, next) => {
    success({
        method: 'updateUserByID',
        body: body,
        params: params
    }, res)
}

const destroyUserByID = ({ params }, res, next) => {
    success({
        method: 'destroyUserByID',
        params: params
    }, res)
}

module.exports = {
    addUser,showUsers,showUserByID,updateUserByID,destroyUserByID
}
