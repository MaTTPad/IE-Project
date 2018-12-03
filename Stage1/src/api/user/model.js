const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const roles = ['user', 'admin']
const Carmodel = require('../car/model').model

const Schema = mongoose.Schema
const userSchema = new Schema({
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        enum: roles,
        default: 'user'
    },
    reservations: {
        type: [Schema.ObjectId],
        ref: 'Reservation',
    }
}, {
    timestamps: true
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next()

    const rounds = 9

    bcrypt.hash(this.password, rounds).then((hash) => {
        this.password = hash
        next()
    }).catch(next)
})


userSchema.methods = {
    view(full) {
        let view = {}
        let fields = ['id', 'name',]

        if (full) {
            fields = [...fields, 'role', 'email', 'reservations']
        }

        fields.forEach((field) => {
            view[field] = this[field]
        })

        return view
    },

    authenticate(password) {
        return bcrypt.compare(password, this.password).then((valid) => valid ? this : false)
    },

    async getReservations() {
        let reservedCars = []
        for(const r of this.reservations){
            reservedCars.push(Carmodel.find({'reservations._id': r}).exec())
        }
        return await Promise.all(reservedCars)
    }


}

userSchema.statics = {
    roles
}

const model = mongoose.model('User', userSchema)

module.exports = {model, userSchema}
