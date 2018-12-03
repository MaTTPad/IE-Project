// Konfiguracja aplikacji

const path = require('path')
const merge = require('lodash/merge')  // biblioteka Lodash: https://lodash.com/

const config = {
    all: {
        env: process.env.NODE_ENV || 'development',
        root: path.join(__dirname, '..'),
        port: 9000,
        ip: '127.0.0.1',
        apiRoot: '/api',
        mongo: {
            options : {
                useCreateIndex: true,        // prevents: DeprecationWarning: collection.ensureIndex is deprecated.
                useNewUrlParser: true,       // prevents: DeprecationWarning: current URL string parser is deprecated
                useFindAndModify: false      // prevents: DeprecationWarning: collection.findAndModify is deprecated
            }
        },
        mail: {
            from: 'IE Wykład <inzyniera.internetu.2018@gmail.com>',
            auth: {
                user: 'cyputywnpc3bmloc@ethereal.email',
                pass: 'E36JzCA9xBEqnB7hk7'
            }
        },

    },
    test: {
        mongo: {
            uri: 'mongodb://admin:zaq12wsx@ds161653.mlab.com:61653/carrental',
        },
        jwtSecret: '4rrfdutpOntGGOVYLdG6hiOQf4v7dY'
    },
    development: {
        mongo: {
            uri: 'mongodb://admin:zaq12wsx@ds161653.mlab.com:61653/carrental',
            options: {
                debug: true
            }
        },
        jwtSecret: '48mXwHcnH8qEwWgzo24y5BEIxgAU0a'
    },
    production: {
        ip: process.env.IP || undefined,
        port: process.env.PORT || 8080,
        mongo: {
            uri: 'mongodb://admin:zaq12wsx@ds161653.mlab.com:61653/carrental',       // Realny adres bazy
        },
        jwtSecret: process.env.SECRET,       // Nigdy nie trzymamy hasel do produkcji w konfiguracji!
        mail: {
            auth: {
                user: 'inzyniera.internetu.2018@gmail.com',
                pass: 'aghis2018'
            }
        }
    }
}

module.exports = merge(config.all, config[config.all.env])
