const db = require('../config/config')

class typicalworkEditorController {
    async getTypicalContent(req, res) {
        if (req.query.year == 'all year') {
            const listYear = await db.query('select DISTINCT pl.plan_year from plan pl, users u where u.users_login = pl.users_login and u.department_id = $1 and u.users_login = $2', 
            [req.user.department_id, req.user.users_login])
            res.status(200).json(listYear.rows)
        } else {
            const tableTypeId = await db.query('select * from tabletype where tabletype_name = $1', [req.query.currentTab])
            const typicalWorkContent = await db.query('select * from typicalwork where tabletype_id = $1', [tableTypeId.rows[0].tabletype_id])
                
            const getplanUserId = await db.query('SELECT plan_id FROM plan WHERE users_login = $1 and plan_year = $2', [req.user.users_login, req.query.year])     
            if (getplanUserId.rowCount != 0) {
                const getplanTableId =  await db.query('select plantable_id from plantable where plan_id = $1 and tabletype_id = $2',
                [getplanUserId.rows[0].plan_id, tableTypeId.rows[0].tabletype_id])

                if (getplanTableId.rowCount != 0) {
                    const typicalWorkContent_state = await db.query('select typicalwork_id from datatable d, plan pl, plantable pt where ' + 
                    'pl.plan_id = pt.plan_id and pt.plantable_id = d.plantable_id and pl.plan_id = $1 and pt.plantable_id = $2', 
                    [getplanUserId.rows[0].plan_id, getplanTableId.rows[0].plantable_id])

                    const actualPlan = await db.query('select plan_actual from plan where plan_year = $1 and users_login = $2', [req.query.year, req.user.users_login])

                    res.status(200).json({content: typicalWorkContent.rows, content_state: typicalWorkContent_state.rows, plan_actual: actualPlan.rows[0].plan_actual})
                } else {
                    res.status(200).json({content: typicalWorkContent.rows, content_state: null})
                }
            } else {
                res.status(200).json({content: typicalWorkContent.rows, content_state: null})
            } 
        }          
    }
    async addTypicalWorkfromPlan(req, res) {            
        const checkPlan = await db.query('SELECT * FROM plan where users_login = $1 and plan_year = $2', [req.user.users_login, req.body.year])
        if (checkPlan.rowCount == 0) {
            var dateNow  = new Date().toLocaleString().slice(0,-3)        
            await db.query('INSERT INTO plan (users_login, plan_date_in, plan_actual) values($1, $2, $3)', [req.user.users_login, dateNow, 'в разработке'])
        }
        const getplanUserId = await db.query('SELECT plan_id FROM plan WHERE users_login = $1 and plan_year = $2', [req.user.users_login, req.body.year])
        const checkplanTableId = await db.query('select * from plantable where plan_id = $1 and tabletype_id = $2', [getplanUserId.rows[0].plan_id, req.body.object.tabletype_id])
        if (checkplanTableId.rowCount == 0) {
            await db.query('INSERT INTO plantable (plan_id, tabletype_id) values($1, $2)', [getplanUserId.rows[0].plan_id, req.body.object.tabletype_id])
        }
        const getplanTableId =  await db.query('select plantable_id from plantable where plan_id = $1 and tabletype_id = $2', 
        [getplanUserId.rows[0].plan_id, req.body.object.tabletype_id])

        if (req.body.object.deadline) {
            await db.query('INSERT INTO datatable (datatable_name, datatable_workload, datatable_deadline, plantable_id, typicalwork_id) values($1, $2, $3, $4, $5)', 
            [req.body.object.typicalwork_name, req.body.object.typicalwork_workload, req.body.object.deadline, getplanTableId.rows[0].plantable_id, req.body.object.typicalwork_id])
        } else {
            await db.query('INSERT INTO datatable (datatable_name, datatable_workload, plantable_id, typicalwork_id) values($1, $2, $3, $4)', 
            [req.body.object.typicalwork_name, req.body.object.typicalwork_workload, getplanTableId.rows[0].plantable_id, req.body.object.typicalwork_id])
        }

        res.json({message: 'ok'})
    }
    async deleteTypicalWork(req, res) {
        const getId = await db.query('select pt.plantable_id from plan pl, plantable pt, tabletype tt  where pl.plan_id = pt.plan_id and ' +
        'pt.tabletype_id = tt.tabletype_id and pl.users_login = $1 and pt.tabletype_id = $2', [req.user.users_login, req.query.tabletype_id])       

        await db.query('delete from datatable where typicalwork_id = $1 and plantable_id = $2', [req.query.typicalwork_id, getId.rows[0].plantable_id])
        res.send({message: 'ok'})
    }
}

module.exports = new typicalworkEditorController()
