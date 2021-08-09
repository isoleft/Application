const db = require('../config/config')

class mainSecretaryController {
    async getListPlans(req, res) {
        if (req.query.year == 'all year') {
            const listYear = await db.query('select DISTINCT pl.plan_year from plan pl, users u where u.users_login = pl.users_login and u.department_id = $1', [req.user.department_id])
            res.status(200).json(listYear.rows)
        } else {
            let plans = null        
            if (req.query.year == 'Все доступные года') {
                plans = await db.query('select u.users_name, pl.plan_id, pl.plan_name, pl.plan_date_in, pl.plan_year, pl.plan_bet, pl.post_id, pl.academicdegree_id,' + 
                ' pl.academicrank_id, pl.plan_actual from users u, plan pl where u.users_login = pl.users_login and u.department_id = $1 order by pl.plan_id', [req.user.department_id])
            } else {
                plans = await db.query('select u.users_name, pl.plan_id, pl.plan_name, pl.plan_date_in, pl.plan_year, pl.plan_bet, pl.post_id, pl.academicdegree_id,' + 
                ' pl.academicrank_id, pl.plan_actual from users u, plan pl where u.users_login = pl.users_login and u.department_id = $1 and pl.plan_year = $2 order by pl.plan_id', [req.user.department_id, req.query.year])
            }         
            
            const post = await db.query('select * from post')
            const degree = await db.query('select * from academicdegree')
            const rank = await db.query('select * from academicrank')
            const messages = await db.query('select m.messages_content, u.users_name, m.messages_date  from messages m, users u where m.messages_sender = u.users_login and messages_recipient = $1', 
            [req.user.users_login])

            res.status(200).json({plans: plans.rows, post: post.rows, degree: degree.rows, rank: rank.rows, user: req.user.users_login, messages: messages.rows })
        }
    }
}

module.exports = new mainSecretaryController()
