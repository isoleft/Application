const db = require('../config/config')

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const tokenKey = '1a2b-3c4d-5e6f-7g8h'

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: tokenKey
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            const user = await db.query('SELECT users_login, users_name, users_mail, access_id, department_id from users where users_login = $1',
            [payload.users_login])       

            if(user) {
                done(null, user.rows[0])
            } else {
                done(null, false)
            }
        })
    )
}