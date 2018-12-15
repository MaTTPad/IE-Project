const mongoose = require('mongoose')
const {Schema} = require('mongoose')
const Reservation = require('./model-reservation').reservationSchema

const carmodelSchema = new Schema({
    manufacturer: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    VIN: {
        type: String,
        required: true,
        unique:true
    },
    doors: {
        type: Number,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    price_per_hour:{
      type: Number,
      required : true
    },
    reservations: {
        type: [Reservation],
        required: false

    }
}, {
    timestamps: true,
})

carmodelSchema.methods = {
    view(full) {
        const view = {
            // simple view
            id: this._id,
            manufacturer: this.manufacturer,
            model: this.model,
            VIN: this.VIN,
            price_per_hour: this.price_per_hour
        }

        return full ? {
            ...view,
            doors: this.doors,
            class: this.class,
            reservations: this.reservations,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        } : view
    }
}

const model = mongoose.model('Car', carmodelSchema)

module.exports = {model, carmodelSchema}
