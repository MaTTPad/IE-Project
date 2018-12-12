const server = require('../../app')
const User = require('../user/model').model
const Car = require('../car/model').model
const mongoose = require('../../services/mongoose/index')

//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should();

chai.use(chaiHttp);

describe('User and car test', () => {
    token = ''
    carID= ' '

    before((done) => { //Before each test we empty the database
        User.deleteMany({}, (err) => {
            Car.deleteMany({}, (err) => {
                done();
            });        });

    });

    describe('POST /api/users', () => {
        it('It should register user.', (done) => {
            let user = {
                email: 'test@gmail.com',
                name: 'Jan Kowalski',
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
                    res.body.user.should.have.property('name').equal('Jan Kowalski');
                    res.body.user.should.have.property('email').equal('test@gmail.com');
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
                .auth('test@gmail.com', '123456789')
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

//});


// describe('Car', () => {
//     token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMTEwN2RjZjg2YWY5MjJlNGExNGIyMyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNTQ0NjE5OTk2fQ.N03Lek8zYO1rtQ8Wzm0ZHZi0tqB8VQ23DtyA55vrlYo'
//
//     before((done) => { //Before each test we empty the database
//         Car.deleteMany({}, (err) => {
//             done();
//         });
//     });

    describe('POST /api/cars', () => {
        it('It should add new car.', (done) => {
            let car = {
                manufacturer: 'Audi',
                model: 'A4',
                VIN: 'AUUZZZ8147164',
                doors: 5,
                class: 'Sedan'
            }
            chai.request(server)
                .post('/api/cars')
                .set('Authorization', `Bearer ${token}`)
                .send(car)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('manufacturer').equal('Audi');
                    res.body.should.have.property('model').equal('A4');
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



    describe('DELETE /api/car/:id', () => {
        it('It should delete car', (done) => {
            chai.request(server)
                .delete('/api/cars/'+carID)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(204);
                    // res.body.should.be.an('array');
                    // res.body[0].should.have.property('id');
                    // res.body[0].should.have.property('manufacturer');
                    // res.body[0].should.have.property('model');
                    // res.body[0].should.have.property('VIN');
                    // carID = res.body[0].id
                    done();
                });
        });
    });

});
