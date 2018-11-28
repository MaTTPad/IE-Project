// Tu definiujemy model bazodanowy

const mongoose = require('mongoose')
const { Schema } = require('mongoose')
//const Dimensions = require('./model-dimensions').dimensionsSchema

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
    reservations: [
        {
            pick_up_date: {type: Date, required: true},
            drop_off_date: {type: Date, required: true},
            user_id: {type:mongoose.Schema.Types.ObjectId , required: false, ref:'User'}
        }],

}, {
    timestamps: true,
})

carmodelSchema.methods = {
    view (full) {
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
            /*reservations:[
                pick_up_date: this.pick_up_date,
                drop_off_date: this.drop_off_date
            ]*/
            reservations:this.reservations,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        } : view
    }
}

const model = mongoose.model('Car', carmodelSchema)

module.exports = {model, carmodelSchema}

