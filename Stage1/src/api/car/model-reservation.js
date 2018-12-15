const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const reservationSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
    },
    pick_up_date: {
        type: Date
    },
    drop_off_date: {
        type: Date
    },
    total_price:{
        type: Number
    }
})

reservationSchema.methods = {
    viewBy(user) {
        const view = {
            id: this._id,
            from: this.from,
            to: this.to,
            total_price:this.total_price
        }

        return user.role === 'admin' ? {...view, user: this.user} : view
    }
}


const model = mongoose.model('Reservation', reservationSchema)

module.exports = {model, reservationSchema}
