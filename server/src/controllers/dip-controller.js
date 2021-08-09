const db = require('../config/config')

class dipController {
    async getContent(req, res) {
        const content = await db.query('select * from listdip where listdip_department_id = $1', [req.user.department_id])
        const teachers = await db.query('select users_name from users where department_id = $1 and access_id = $2', [req.user.department_id, 1])
        res.status(200).json({content: content.rows, teachers: teachers.rows})    
    }
    async add (req, res){
        await db.query('insert into listdip(listdip_group, listdip_teacher_name, listdip_students, listdip_department_id) values($1,$2,$3,$4)',
        [req.body.object.listdip_group, req.body.object.listdip_teacher_name, req.body.object.listdip_students, req.user.department_id])

        res.json({message: 'ok'})
    }
    async delete (req, res) {
        console.log(req)
        await db.query('delete from listdip where listdip_id = $1', [req.query.id])
        res.json({message: 'ok'})
    }
}

module.exports = new dipController()