const server = require('../../app')
const Car = require('./model').model
const mongoose = require('../../services/mongoose')

//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should();

chai.use(chaiHttp);

describe('Car', () => {
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMGU3YzI1NzhiMDkyMWZmODZjYmI0NyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTU0NDQ1MzMwMX0.tiaGOMgoyN32i0HYgA_TBB2L4BUQSG_5ZRU6CKj3GYc'

    before((done) => { //Before each test we empty the database
        Car.deleteMany({}, (err) => {
            done();
        });
    });

    describe('POST /api/cars', () => {
        it('it should create car', (done) => {
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
    //
    // describe('POST /api/users/auth', () => {
    //     it('it should login user', (done) => {
    //         chai.request(server)
    //             .post('/api/users/auth')
    //             .auth('lrauch@agh.edu.pl', 'mojetajnehaslo123')
    //             .end((err, res) => {
    //                 res.should.have.status(201);
    //                 res.body.should.be.a('object');
    //                 res.body.should.have.property('token');
    //                 done();
    //             });
    //     });
    // });
    //
    // describe('GET /api/users/me', () => {
    //     it('it should get user informations', (done) => {
    //         chai.request(server)
    //             .get('/api/users/me')
    //             .set('Authorization', `Bearer ${token}`)
    //             .end((err, res) => {
    //                 res.should.have.status(200);
    //                 res.body.should.be.a('object');
    //                 res.body.should.have.property('role');
    //                 done();
    //             });
    //     });
    // });

});
