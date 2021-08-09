const db = require('../config/config')
const bcrypt = require('bcryptjs')

class userRegController {
    async createUser (req, res) {   
        const candidate = await db.query('SELECT users_login from users where users_login = $1', [req.body.users_login])      
        if(candidate.rowCount == 1) {       
            res.status(409).json({ message: 'Данный логин уже занят. Попробуйте другой!'})
        } else {
            const salt = bcrypt.genSaltSync(10)
            const { users_login, users_password, users_name, users_mail, access_id, department_id } = req.body 
            await db.query ('INSERT INTO users (users_login, users_password, users_name, users_mail, access_id, department_id) values($1, $2, $3, $4, $5, $6) RETURNING *', 
            [users_login, bcrypt.hashSync(users_password, salt), users_name, users_mail, access_id, department_id])

            res.status(201).json({ message: 'Вы успешно зарегистрировались!'})
        }
    }
    async listDepartment (req, res) {           
        const list = await db.query('SELECT department_id, department_name from department')   
        res.status(200).json(list.rows)
    }
}

module.exports = new userRegController()
