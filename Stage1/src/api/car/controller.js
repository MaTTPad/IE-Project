const { success, notFound } = require('../../services/response/')
const Carmodel = require('./model').model

const createCar = ({ body }, res, next) =>
  Carmodel.create(body)
    .then((carmodel) => carmodel.view(true))
    .then(success(res, 201))
    .catch(next)

const showAllCars = (req, res, next) =>
  Carmodel.find()
    .then((carmodels) => carmodels.map((carmodel) => carmodel.view()))
    .then(success(res))
    .catch(next)

const showCarById = ({ params }, res, next) =>
  Carmodel.findById(params.id)
    .then(notFound(res))
    .then((carmodel) => carmodel ? carmodel.view(true) : null)
    .then(success(res))
    .catch(next)

const updateCarById = ({ body , params }, res, next) =>
  Carmodel.findById(params.id)
    .then(notFound(res))
    .then((carmodel) => carmodel ? Object.assign(carmodel, body).save() : null)
    .then((carmodel) => carmodel ? carmodel.view(true) : null)
    .then(success(res))
    .catch(next)

const deleteCarById = ({ params }, res, next) =>
  Carmodel.findById(params.id)
    .then(notFound(res))
    .then((carmodel) => carmodel ? carmodel.remove() : null)
    .then(success(res, 204))
    .catch(next)

const search = ({query}, res, next) => {
    let dbquery = []
    for(const key in query){
        switch (key) {
            case 'model':
                dbquery.push({"model": {$regex: new RegExp(`${query['model']}`), $options: 'i'}})
                break;
           /* case 'yearmin':
                dbquery.push({"year": {$gte: parseInt(query['yearmin']) }})
                break;
            case 'yearmax':
                dbquery.push({"year": {$lte: parseInt(query['yearmax']) }})
                break;*/
        }
    }

    if(dbquery.length === 0) return res.json([])

    return Carmodel.find({$and : dbquery}).sort({model: -1}).limit(10)
        .then(notFound(res))
        .then((carmodel) => carmodel ? carmodel.map(carmodel => carmodel.view(false)) : null)
        .then(success(res))
        .catch(next)
    }

module.exports = {
    createCar, showAllCars, showCarById, updateCarById, deleteCarById, search
}
