const mongoose = require('mongoose')
const {Schema} = require('mongoose')

// https://mongoosejs.com/docs/schematypes.html
const usermodelSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: {unique: true}
    },
    lastname: {
        type: String,
        required: true
    },
    drivingLicenseNumber: {
        type: Number
    },
    reservedCars: [
        {
            car_id: {type:mongoose.Schema.Types.ObjectId, required: false, ref:'Car'}
        }],
}, {
    timestamps: true,
})

usermodelSchema.methods = {
    view(full) {

        if(full==true)
        {

            const view = {
                // simple view
                id: this._id,
                name: this.name,
                lastname: this.lastname,
                drivingLicenseNumber: this.drivingLicenseNumber,
                reservedCars: this.reservedCars,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt
            }
            return view;

        }
        else
        {
            const view = {
                // simple view
                id: this._id,
                name: this.name
            }
            return view;

        }

    }
}

const model = mongoose.model('User', usermodelSchema)

module.exports = {model, usermodelSchema}

