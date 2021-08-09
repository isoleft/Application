const db = require('../config/config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const tokenKey = '1a2b-3c4d-5e6f-7g8h'

class userAuthController {
    async Authorization (req, res) {      
        const candidate = await db.query('SELECT u.users_login, u.users_password, u.users_name, u.users_mail, u.access_id, u.department_id, a.access_type ' + 
        'from users u, access a where u.access_id = a.access_id and u.users_login = $1 and u.access_id = $2', 
        [req.body.users_login, req.body.access_id])
        const access = await db.query('SELECT access_type from access where access_id = $1', [req.body.access_id])     
        if(candidate.rowCount == 1) {   
            const password = bcrypt.compareSync(req.body.users_password, candidate.rows[0].users_password)         
            if(password) {
                const token = jwt.sign({
                    users_login: candidate.rows[0].users_login,
                    users_name: candidate.rows[0].users_name,
                    users_mail: candidate.rows[0].users_mail,
                    access_id: candidate.rows[0].access_id,
                    department_id: candidate.rows[0].department_id
                }, tokenKey, {expiresIn: 60 * 60})

                res.status(200).json({
                    token: `Bearer ${token}`
                })                       
            } else {
                res.json({ status: 401, message: 'Пароли не совпадают! Попробуйте снова'})
            }
        } else {
            res.json({status: 404, message: access.rows[0].access_type + ' с таким логином не найден!'})
        }
    }
}

module.exports = new userAuthController()
