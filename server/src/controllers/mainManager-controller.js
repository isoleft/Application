const db = require('../config/config')

class mainTeacherManager {
    async getListPlans(req, res) {            
        const plans = await db.query('select u.users_name, pl.plan_id, pl.plan_name, pl.plan_date_in, pl.plan_year, pl.plan_bet, pl.post_id, pl.academicdegree_id,' + 
        ' pl.academicrank_id from users u, plan pl where u.users_login = pl.users_login and u.department_id = $1 and pl.plan_actual = $2', 
        [req.user.department_id, 'На рассмотрении'])
        
        const post = await db.query('select * from post')
        const degree = await db.query('select * from academicdegree')
        const rank = await db.query('select * from academicrank')

        const messages = await db.query('select m.messages_content, u.users_name, m.messages_date  from messages m, users u where m.messages_sender = u.users_login and messages_recipient = $1', 
        [req.user.users_login])

        res.status(200).json({plans: plans.rows, post: post.rows, degree: degree.rows, rank: rank.rows, user: req.user.users_login, messages: messages.rows})          
    }
}

module.exports = new mainTeacherManager()