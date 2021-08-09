const db = require('../config/config')

class contentPlanController {
    async getContent(req, res) {       
        if (req.query.currentTab == 'Осенний семестр' || req.query.currentTab == 'Весенний семестр') {
            let semestr = req.query.currentTab.slice(0,-8)
            semestr = semestr.charAt(0).toLowerCase() + semestr.slice(1)
        
            const content = await db.query('select * from dataeduwork de, eduwork ed, plan pl where pl.plan_id = ed.plan_id and ed.eduwork_id = de.eduwork_id ' + 
            'and pl.plan_id = $1 and ed.eduwork_semestr = $2 order by de.dataeduwork_id', [req.params.id, semestr])
            for (let i = 0; i < content.rowCount; i++) {
                content.rows[i].dataeduwork_sum1 = content.rows[i].dataeduwork_lec + content.rows[i].dataeduwork_lab + content.rows[i].dataeduwork_prac + content.rows[i].dataeduwork_zach + 
                content.rows[i].dataeduwork_ekz + content.rows[i].dataeduwork_lead_vkr + content.rows[i].dataeduwork_p_edu  + content.rows[i].dataeduwork_p_prod + content.rows[i].dataeduwork_p_dip +
                content.rows[i].dataeduwork_gos + content.rows[i].dataeduwork_vkr + content.rows[i].dataeduwork_srs + content.rows[i].dataeduwork_asp
                content.rows[i].dataeduwork_sum2 = content.rows[i].dataeduwork_p_lec + content.rows[i].dataeduwork_p_prac + content.rows[i].dataeduwork_lab + content.rows[i].dataeduwork_p_theme
                if (content.rows[i].dataeduwork_sum2 == 0) {
                    content.rows[i].dataeduwork_sum2 = null
                }
            }
            const actualPlan = await db.query('select plan_actual from plan where plan_id = $1', [req.params.id])
                    
            res.status(200).json({ content: content.rows, access_id: req.user.access_id, plan_actual: actualPlan.rows[0].plan_actual})        
        } else if (req.query.currentTab == 'Оценка работы преподавателя') {                 
            const contentAssessment = await db.query('select * from assessment where plan_id = $1', [req.params.id])
            
            const actualPlan = await db.query('select plan_actual from plan where plan_id = $1', [req.params.id])
            const year = await db.query('select plan_year from plan where plan_id = $1', [req.params.id])

            res.status(200).json({ content: contentAssessment.rows, access_id: req.user.access_id, plan_actual: actualPlan.rows[0].plan_actual, year: year.rows[0].plan_year})
        } else {      
            const contentTypicalWork = await db.query('select * from datatable d, plantable pt, tabletype tt where d.plantable_id = pt.plantable_id and ' +
            'pt.tabletype_id = tt.tabletype_id and pt.plan_id = $1 and tt.tabletype_name = $2', [req.params.id, req.query.currentTab])        
            const tableTypeId = await db.query('select * from tabletype where tabletype_name = $1', [req.query.currentTab])           
            const columnsTable = await db.query('select th.tableheader_column1, th.tableheader_column2, th.tableheader_column3, th.tableheader_column4 from tableHeader th, tabletype tt ' +
            'where th.tableheader_id = tt.tableheader_id and tt.tabletype_id = $1', [tableTypeId.rows[0].tabletype_id]) 
            const actualPlan = await db.query('select plan_actual from plan where plan_id = $1', [req.params.id])     
            const columns = []                        
            if (columnsTable.rows[0].tableheader_column1 != null) {           
                columns.push({title: columnsTable.rows[0].tableheader_column1, key: 'datatable_name', align: 'center'})
            }
            if (columnsTable.rows[0].tableheader_column2 != null) {
                columns.push({title: columnsTable.rows[0].tableheader_column2, key: 'datatable_workload', align: 'center'})
            }
            if (columnsTable.rows[0].tableheader_column3 != null) {
                columns.push({title: columnsTable.rows[0].tableheader_column3, key: 'datatable_deadline', align: 'center'})
            } 
            if (columnsTable.rows[0].tableheader_column4 != null) {
                columns.push({title: columnsTable.rows[0].tableheader_column4, slot: 'datatable_mark', key: 'datatable_mark', align: 'center'})
            }
            columns.push({title: 'Действие', slot: 'delete', headSlot: 'header', key: 'delete', align: 'center'})  
         
            const typicalWorkContent = await db.query('select * from typicalwork where tabletype_id = $1', [tableTypeId.rows[0].tabletype_id])
            let arrayWork = []
            for (let i = 0; i < typicalWorkContent.rowCount; i++) {
                let state = false
                for (let j = 0; j < contentTypicalWork.rowCount; j++) {          
                    if (typicalWorkContent.rows[i].typicalwork_id == contentTypicalWork.rows[j].typicalwork_id) {
                        state = true
                    }
                }
                if (state == false) {
                    arrayWork.push(typicalWorkContent.rows[i])
                }
            }
            const year = await db.query('select plan_year from plan where plan_id = $1', [req.params.id])
           res.status(200).json({ content: contentTypicalWork.rows, access_id: req.user.access_id, columns: columns, plan_actual: actualPlan.rows[0].plan_actual, 
            listTypicalWork: arrayWork, year: year.rows[0].plan_year})
        }
    }
    async deleteTypicalWork(req, res) {       
        const getTableTypeId = await db.query('select tabletype_id from tabletype where tabletype_name = $1',[req.query.currentTab])     
        const getplanTableId =  await db.query('select plantable_id from plantable where plan_id = $1 and tabletype_id = $2',[req.params.id, getTableTypeId.rows[0].tabletype_id])    
        await db.query('delete from datatable where typicalwork_id = $1 and plantable_id = $2', [req.query.idWork, getplanTableId.rows[0].plantable_id])

        res.send({message: 'ok'})
    }
    async sendMessage (req, res) {
        var dateNow  = new Date().toLocaleString().slice(0,-3)
        if (req.user.access_id == 0) {
            const messages_recipient = await db.query('select u.users_login from users u, plan pl where u.users_login = pl.users_login and pl.plan_id = $1', 
            [req.params.id])

            const message_content = 'Доступна новая версия учебной работы за ' + req.body.currentTab
            await db.query('insert into messages(messages_content, messages_sender, messages_recipient, messages_date) values($1, $2, $3, $4)', 
            [message_content, req.user.users_login, messages_recipient.rows[0].users_login, dateNow])

            res.json({message: 'ok'})
        } else if (req.user.access_id == 1) {
            if (req.body.choiceButton == 'error') {
                let semestr = req.body.currentTab.slice(0,-8)
                semestr = semestr.charAt(0).toLowerCase() + semestr.slice(1)
    
                const messages_recipient = await db.query('select compiler from eduwork where plan_id = $1 and eduwork_semestr = $2',
                [req.params.id, semestr])
    
                await db.query('insert into messages(messages_content, messages_sender, messages_recipient, messages_date) values($1, $2, $3, $4)', 
                [req.body.message_content, req.user.users_login, messages_recipient.rows[0].compiler, dateNow])
                res.json({message: 'ok'})
            } else {
                const message_content = 'Доступна новая версия индивидуального плана: ' + req.user.users_name

                const messages_recipient = await db.query('select users_login from users where access_id = $1 and department_id = $2', [2, req.user.department_id])
                if (messages_recipient.rowCount == 0) {
                    res.json({message: 'Зав. кафедрой не найден с системе!'})
                } else {
                    await db.query('update plan set plan_actual = $1 where plan_id = $2', ['На рассмотрении', req.params.id])

                    await db.query('insert into messages(messages_content, messages_sender, messages_recipient, messages_date) values($1, $2, $3, $4)', 
                    [message_content, req.user.users_login, messages_recipient.rows[0].users_login, dateNow])
                    res.json({message: 'ok'})
                }
            }
        } else {
            if (req.body.choiceButton == 'error') {
                const messages_recipient = await db.query('select u.users_login from users u, plan pl where u.users_login = pl.users_login and pl.plan_id = $1',
                [req.params.id])

                await db.query('update plan set plan_actual = $1 where plan_id = $2', ['На доработке', req.params.id]) 

                await db.query('insert into messages(messages_content, messages_sender, messages_recipient, messages_date) values($1, $2, $3, $4)', 
                [req.body.message_content, req.user.users_login, messages_recipient.rows[0].users_login, dateNow])
                res.json({message: 'ok'})
            } else {
                const messages_recipient = await db.query('select u.users_login from users u, plan pl where u.users_login = pl.users_login and pl.plan_id = $1',
                [req.params.id])

                const year = await db.query('select plan_year from plan where plan_id = $1', [req.params.id])

                const message_content = 'Одобен план за ' + year.rows[0].plan_year

                await db.query('update plan set plan_actual = $1 where plan_id = $2', ['Одобрен', req.params.id]) 

                await db.query('insert into messages(messages_content, messages_sender, messages_recipient, messages_date) values($1, $2, $3, $4)', 
                [message_content, req.user.users_login, messages_recipient.rows[0].users_login, dateNow])
                res.json({message: 'ok'})
            }
        }
    }
    async addAssessment (req, res) {
        if (req.body.object) {  
            console.log(req)        
            await db.query('update datatable set datatable_mark = $1 where datatable_id = $2', [req.body.object.datatable_mark, req.body.object.datatable_id])
            res.json({message: 'ok'}) 
        } else {
            await db.query('insert into assessment(assessment_semestr, assessment_comment, plan_id) values($1,$2,$3)', [req.body.semestr, req.body.text, req.params.id])
            res.json({message: 'ok'}) 
        }
    }
}

module.exports = new contentPlanController()