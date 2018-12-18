const server = require('../../app')
const User = require('../user/model').model
const Car = require('../car/model').model
const mongoose = require('../../services/mongoose/index')

const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should();

chai.use(chaiHttp);

describe('User and car test', () => {
    token = ''
    carID= ''
    reservationID= ''

    before((done) => {
        User.deleteMany({}, (err) => {
            Car.deleteMany({}, (err) => {
                done();
            });        });

    });

    describe('POST /api/users', () => {
        it('It should register user.', (done) => {
            let user = {
                email: 'mpadula06@gmail.com',
                name: 'Jan',
                lastname:'Kowalski',
                role: 'admin',
                password: '123456789'
            }

            chai.request(server)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.should.have.property('token');
                    res.body.should.have.property('user');
                    res.body.user.should.have.property('id');
                    res.body.user.should.have.property('name').equal('Jan');
                    res.body.user.should.have.property('lastname').equal('Kowalski');
                    res.body.user.should.have.property('email').equal('mpadula06@gmail.com');
                    res.body.user.should.have.property('reservations');
                    res.body.user.reservations.should.be.an('array').to.be.empty;

                    token = res.body.token
                    done();
                });
        });
    })

    describe('POST /api/users/auth', () => {
        it('It should login user.', (done) => {
            chai.request(server)
                .post('/api/users/auth')
                .auth('mpadula06@gmail.com', '123456789')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done();
                });
        });
    });

    describe('GET /api/users/me', () => {
        it('It should get user information.', (done) => {
            chai.request(server)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('role');
                    done();
                });
        });
    });

    describe('POST /api/cars', () => {
        it('It should add new car.', (done) => {
            let car = {
                manufacturer: 'Volkswagen',
                model: 'Golf',
                VIN: 'AUUZZZ8147164',
                doors: 5,
                class: 'Sedan',
                price_per_hour : 30
            }
            chai.request(server)
                .post('/api/cars')
                .set('Authorization', `Bearer ${token}`)
                .send(car)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('manufacturer').equal('Volkswagen');
                    res.body.should.have.property('model').equal('Golf');
                    res.body.should.have.property('reservations');
                    res.body.reservations.should.be.an('array').to.be.empty;
                    done();
                });
        });
    })

    describe('GET /api/cars', () => {
        it('It should get cars information', (done) => {
            chai.request(server)
                .get('/api/cars')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body[0].should.have.property('id');
                    res.body[0].should.have.property('manufacturer');
                    res.body[0].should.have.property('model');
                    res.body[0].should.have.property('VIN');
                    carID = res.body[0].id
                    done();
                });
        });
    });

    describe('POST /api/cars/:id/reservations', () => {
        it('It should add new reservation.', (done) => {
            let reservation = {
                pick_up_date: "Janary 24, 2019 03:00:01",
                drop_off_date: "January 24, 2019 09:00:00",

            }

            chai.request(server)
                .post('/api/cars/'+carID+'/createReservation')
                .set('Authorization', `Bearer ${token}`)
                .send(reservation)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body[0].should.have.property('id');
                    reservationID=res.body[0].id
                    res.body[0].total_price.should.be.equal(180)
                    done();
                });
        });
    })



    describe('DELETE /api/car/:id/reservations/:reservationID', () => {
        it('It should delete reservation', (done) => {
            chai.request(server)
                .delete('/api/cars/'+carID+'/reservations/'+reservationID)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });


    describe('DELETE /api/car/:id', () => {
        it('It should delete car', (done) => {
            chai.request(server)
                .delete('/api/cars/'+carID)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
    });

});
