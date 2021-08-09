const db = require('../config/config')

class editPlanController {
    async getPlan(req, res) {
        const plan = await db.query('select plan_name, plan_bet, post_id, academicdegree_id, academicrank_id from plan where plan_id = $1 order by plan_id', [req.params.id])
        
        const post = await db.query('select * from post')
        const degree = await db.query('select * from academicdegree')  
        const rank = await db.query('select * from academicrank')
        
        res.status(200).json({ plan: plan.rows[0], post: post.rows, degree: degree.rows, rank: rank.rows, access_id: req.user.access_id})
    }
    async updatePlan(req, res) {      
        await db.query('update plan set plan_name = $1, plan_bet = $2, post_id = $3, academicdegree_id = $4, academicrank_id = $5 where plan_id = $6', 
        [req.body.object.plan_name, req.body.object.plan_bet, req.body.object.post_id, req.body.object.academicdegree_id, req.body.object.academicrank_id,
        req.params.id])

        res.status(201).json({message: 'ok'})
    }
}

module.exports = new editPlanController()