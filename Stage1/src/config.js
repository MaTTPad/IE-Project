// Konfiguracja aplikacji

const path = require('path')
const merge = require('lodash/merge')

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
            from: 'Car Rental <2m32017.2@gmail.com>',
            auth: {
                user: '2m32017.2@gmail.com',
                pass: process.env.PASSWORD
            }
        },

    },
    test: {
        mongo: {
            uri: 'mongodb://admin:admin123@ds129914.mlab.com:29914/carrental_test',
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
        jwtSecret: '48mXwHcnH8qEwWgzo24y5BEIxgAU0a',
        mail: {
            from: 'Car Rental <2m32017.2@gmail.com>',
            auth: {
                user: '2m32017.2@gmail.com',
                pass: process.env.PASSWORD
            }
        },
    },
    production: {
        ip: process.env.IP || undefined,
        port: process.env.PORT || 8080,
        mongo: {
            uri: 'mongodb://admin:zaq12wsx@ds161653.mlab.com:61653/carrental',
        },
        jwtSecret: process.env.SECRET,
        mail: {
            from: 'Car Rental <2m32017.2@gmail.com>',
            auth: {
                user: '2m32017.2@gmail.com',
                pass: process.env.PASSWORD
            }
        }
    }
}

module.exports = merge(config.all, config[config.all.env])
