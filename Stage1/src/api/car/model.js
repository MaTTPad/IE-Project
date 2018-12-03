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
        required: false
    },
    doors: {
        type: Number,
        required: false
    },
    class: {
        type: String,
        required: false
    },
    reservations: {
        type: [Reservation]
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
            VIN: this.VIN
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
