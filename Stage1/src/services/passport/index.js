const passport = require('passport')
const {BasicStrategy} = require('passport-http')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const {jwtSecret} = require('../../config')
const User = require('../../api/user/model').model

const password = () => (req, res, next) =>
    passport.authenticate('password', {session: false}, (err, user, info) => {
        if (err && err.param) {
            return res.status(400).json(err)
        } else if (err || !user) {
            return res.status(401).end()
        }
        req.logIn(user, {session: false}, (err) => {
            if (err) return res.status(401).end()
            next()
        })
    })(req, res, next)

const token = ({required, roles = User.roles, groups=User.userGroups2} = {}) => (req, res, next) =>
    passport.authenticate('token', {session: false}, (err, user, info) => {
        // jesli nie ma uzytkownika w bazie lub niepodano tokenu => 401
        if (err || (required && !user)) {
            return res.status(401).end()
        }
        // jesli uzytkownik nie ma prawa => 403
        if(required && !roles.includes(user.role) || !groups.includes(user.userGroup)){
            return res.status(403).end()
        }
        req.logIn(user, {session: false}, (err) => {
            if (err) return res.status(401).end()
            next()
        })
    })(req, res, next)

passport.use('password', new BasicStrategy((email, password, done) => {
    User.findOne({email}).then((user) => {
        if (!user) {
            done(true)
            return null
        }
        return user.authenticate(password, user.password).then((user) => {
            done(null, user)
            return null
        }).catch(done)
    })
}))

passport.use('token', new JwtStrategy({
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        ExtractJwt.fromAuthHeaderWithScheme('Bearer')
    ]),
    jsonWebTokenOptions: {
        maxAge: '31d'
    }
}, (payload, done) => {
    const {id} = payload
    User.findById(id).then((user) => {
        done(null, user)
        return null
    }).catch(done)
}))


module.exports = {
    password, token
}
