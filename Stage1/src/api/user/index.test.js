const server = require('../../app')
const User = require('./model').model
const mongoose = require('../../services/mongoose')

//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should();

chai.use(chaiHttp);

describe('User', () => {
    token = ''

    before((done) => { //Before each test we empty the database
        User.deleteMany({}, (err) => {
            done();
        });
    });

    describe('POST /api/users', () => {
        it('it should register user', (done) => {
            let user = {
                email: 'lrauch@agh.edu.pl',
                name: 'Łukasz Rauch',
                password: 'mojetajnehaslo123'
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
                    res.body.user.should.have.property('name').equal('Łukasz Rauch');
                    res.body.user.should.have.property('email').equal('lrauch@agh.edu.pl');
                    res.body.user.should.have.property('reservations');
                    res.body.user.reservations.should.be.an('array').to.be.empty;

                    token = res.body.token
                    done();
                });
        });
    })

    describe('POST /api/users/auth', () => {
        it('it should login user', (done) => {
            chai.request(server)
                .post('/api/users/auth')
                .auth('lrauch@agh.edu.pl', 'mojetajnehaslo123')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done();
                });
        });
    });

    describe('GET /api/users/me', () => {
        it('it should get user informations', (done) => {
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

});
