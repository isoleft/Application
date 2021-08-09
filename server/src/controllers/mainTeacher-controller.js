const db = require('../config/config')

class mainTeacherController {
    async getListPlans(req, res) {
        if (req.query.year == 'all year') {
            const listYear = await db.query('select DISTINCT pl.plan_year from plan pl, users u where u.users_login = pl.users_login and u.department_id = $1 and u.users_login = $2', 
            [req.user.department_id, req.user.users_login])
            if (listYear.rowCount == 0) {
                const post = await db.query('select * from post')
                const degree = await db.query('select * from academicdegree')
                const rank = await db.query('select * from academicrank')
                res.json({status: 404, user: req.user.users_login, post: post.rows, degree: degree.rows, rank: rank.rows})
            } else {
                res.status(200).json(listYear.rows)
            }           
        } else {
            let plans = null       
            if (req.query.year == 'Все доступные года') {
                plans = await db.query('select u.users_name, pl.plan_id, pl.plan_name, pl.plan_date_in, pl.plan_year, pl.plan_bet, pl.post_id, pl.academicdegree_id,' + 
                ' pl.academicrank_id, pl.plan_actual from users u, plan pl where u.users_login = pl.users_login and u.department_id = $1 and u.users_login = $2 order by pl.plan_id', 
                [req.user.department_id, req.user.users_login])            
            } else {
                plans = await db.query('select u.users_name, pl.plan_id, pl.plan_name, pl.plan_date_in, pl.plan_year, pl.plan_bet, pl.post_id, pl.academicdegree_id,' + 
                ' pl.academicrank_id, pl.plan_actual from users u, plan pl where u.users_login = pl.users_login and u.department_id = $1 and u.users_login = $2 and pl.plan_year = $3 order by pl.plan_id', 
                [req.user.department_id, req.user.users_login, req.query.year])
            }
            const post = await db.query('select * from post')
            const degree = await db.query('select * from academicdegree')
            const rank = await db.query('select * from academicrank')

            const messages = await db.query('select m.messages_content, u.users_name, m.messages_date  from messages m, users u where m.messages_sender = u.users_login and messages_recipient = $1', 
            [req.user.users_login])

            res.status(200).json({plans: plans.rows, post: post.rows, degree: degree.rows, rank: rank.rows, user: req.user.users_login, messages: messages.rows})
        }      
    }
    async addPlan(req, res) {
        const checkPlanYear = await db.query('select * from plan where users_login = $1 and plan_year = $2', [req.user.users_login, req.body.object.plan_year])
        if (checkPlanYear.rowCount == 0) {
            let post = null
            let academicdegree = null
            let academicrank = null
            var dateNow  = new Date().toLocaleString().slice(0,-3)
            if (req.body.post_name != null) {
                post = await  db.query('select post_id from post where post_name = $1', [req.body.object.post_name])
                post = post.rows[0].post_id
            }   
            if (req.body.academicdegree_name != null) {
                academicdegree = await  db.query('select academicdegree_id from academicdegree where academicdegree_name = $1', [req.body.object.academicdegree_name])
                academicdegree = academicdegree.rows[0].academicdegree_id 
            } 
            if (req.body.academicrank_name != null) {
                academicrank = await  db.query('select academicrank_id from academicrank where academicrank_name = $1', [req.body.object.academicrank_name]) 
                academicrank = academicrank.rows[0].academicrank_id
            }
            await db.query('insert into plan (users_login, plan_name, plan_date_in, plan_year, post_id, academicdegree_id, academicrank_id, plan_bet, plan_actual) ' + 
            'values($1, $2, $3, $4, $5, $6, $7, $8, $9)', [req.user.users_login, req.body.object.plan_name, dateNow, req.body.object.plan_year, post, 
            academicdegree, academicrank, req.body.object.plan_bet, 'в разработке'])
            res.status(201).json({message: 'ok'})
        } else {
            res.json({message: 404})
        }
    }
}

module.exports = new mainTeacherController()