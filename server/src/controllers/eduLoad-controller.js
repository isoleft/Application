const db = require('../config/config')

class eduLoadController {
    async addEduLoad (req, res) {
        if (req.body.stateDelete == true) {
            await db.query('delete from eduload where department_id = $1 and eduload_year = $2', [req.user.department_id, req.body.eduload_year])
        }
        let count = 0
        for (let i = 0; i < req.body.params.length; i++) {
            const { eduload_form, eduload_code, eduload_name, eduload_type, eduload_group, eduload_students, eduload_semestr, eduload_lec, 
            eduload_lab, eduload_pr, eduload_ekz, eduload_zach, eduload_srs, eduload_prac, eduload_dip, eduload_gak, eduload_sum, eduload_idz, eduload_plec, eduload_ppr, eduload_year 
            } = req.body.params[i]
            
            let request = 'INSERT INTO eduload (eduload_form, eduload_code, eduload_name, eduload_type, eduload_group, eduload_students, eduload_semestr, ' +
            'eduload_lec, eduload_lab, eduload_pr, eduload_ekz, eduload_zach, eduload_srs, eduload_prac, eduload_dip, eduload_gak, eduload_sum,' +
            'eduload_idz, eduload_plec, eduload_ppr, eduload_year, department_id' + ') values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *'
            await db.query (request, [eduload_form, eduload_code, eduload_name, eduload_type, eduload_group, eduload_students, eduload_semestr, eduload_lec, 
                eduload_lab, eduload_pr, eduload_ekz, eduload_zach, eduload_srs, eduload_prac, eduload_dip, eduload_gak, eduload_sum, eduload_idz, eduload_plec, eduload_ppr, 
                req.body.eduload_year, req.user.department_id])               
            count++            
        } 
        if(count == req.body.params.length) {
            res.status(201).json({message: 'Нагрузка успешно добавлена!'})
        } else {
            res.status(501)
        }
    }

    async loadContent (req, res) {   
        if (req.query.year == 'all year') {     
            const listYear = await db.query('SELECT DISTINCT eduload_year from eduload WHERE department_id = $1', [req.user.department_id])
            if (listYear.rowCount == 0) {
                res.json({status: 404})
            } else {
                res.status(200).json(listYear.rows)
            }
        } else {                
            const content_eduLoad = await db.query('SELECT eduload_id, eduload_form, eduload_code, eduload_name, eduload_type, eduload_group, eduload_students, eduload_semestr, ' +
            'eduload_lec, eduload_lab, eduload_pr, eduload_ekz, eduload_zach, eduload_srs, eduload_prac, eduload_dip, eduload_gak, eduload_sum,' +
            'eduload_idz, eduload_plec, eduload_ppr, eduload_year FROM eduload WHERE department_id = $1 and eduload_year = $2 ORDER BY eduload_id',
            [req.user.department_id, req.query.year])

            const content_state = await db.query('select eduload_id, teacher_lec, teacher_prac, teacher_lab, teacher_idz from eduload where eduload_year = $1 and department_id = $2',
            [req.query.year, req.user.department_id])

            const listUsers = await db.query('SELECT users_login, users_name from users WHERE department_id = $1 and access_id = $2', [req.user.department_id, 1])   
            
            if (content_eduLoad.rowCount == 0) {
                res.json({status: 404})
            } else {
                res.json({ content: content_eduLoad.rows, users: listUsers.rows, state: content_state.rows })
            }
        }  
    }

    async loadDistribution (req, res) {
        await db.query('delete from dataeduwork where department_id = $1 and dataeduwork_year = $2', [req.user.department_id, req.body.year])

        const listTeacher = await db.query('select * from users where department_id = $1 and access_id = $2', [req.user.department_id, 1])
        for (let k = 0; k < listTeacher.rowCount; k++) {    
            var dateNow  = new Date().toLocaleString().slice(0,-3)       
            const checkPlan = await db.query('SELECT * FROM plan where users_login = $1 and plan_year = $2', [listTeacher.rows[k].users_login, req.body.year])
            if (checkPlan.rowCount == 0) {        
                await db.query('INSERT INTO plan (users_login, plan_date_in, plan_year, plan_actual) values($1, $2, $3, $4)', 
                [listTeacher.rows[k].users_login, dateNow, req.body.year, 'в разработке'])                        
            }

            const getPlanId = await db.query('select plan_id from plan where users_login = $1 and plan_year = $2',[listTeacher.rows[k].users_login, req.body.year])
            let checkeduWork = await db.query('select eduwork_id from eduwork where plan_id = $1',[getPlanId.rows[0].plan_id])
            if (checkeduWork.rowCount == 0) {
                await db.query('INSERT INTO eduwork (plan_id, eduwork_semestr, eduwork_plan_fact, eduwork_date_actual, compiler) values($1, $2, $3, $4, $5)', 
                [getPlanId.rows[0].plan_id, 'осенний', false , dateNow, req.user.users_login])

                await db.query('INSERT INTO eduwork (plan_id, eduwork_semestr, eduwork_plan_fact, eduwork_date_actual, compiler) values($1, $2, $3, $4, $5)', 
                [getPlanId.rows[0].plan_id, 'весенний', false , dateNow, req.user.users_login])
            }
        }
        let listDip = await db.query('select * from listdip where listdip_department_id = $1',[req.user.department_id])
        for (let i = 0; i < req.body.arrayObject.length; i++) {
            let flag_practic = false
            let flag_lab = false
            let flag_idz = false
            let kurs = null
            let semestr = req.body.arrayObject[i].eduload_semestr

            if (semestr == 1 || semestr == 2) {
                kurs = 1
            } else if (semestr == 3 || semestr == 4) {
                kurs = 2
            } else if (semestr == 5 || semestr == 6) {
                kurs = 3
            } else if (semestr == 7 || semestr == 8) {
                kurs = 4
            } else if (semestr == 9 || semestr == 10) {
                kurs = 5
            }   
            if(semestr % 2 == 0) {
                semestr = 'весенний'
            } else {
                semestr = 'осенний'
            } 
            if (req.body.arrayObject[i].eduload_code != 1601096 && req.body.arrayObject[i].eduload_code != 1601097 && req.body.arrayObject[i].eduload_code != 1601091 && req.body.arrayObject[i].eduload_code != 1601092
                && req.body.arrayObject[i].eduload_code != 1601093 && req.body.arrayObject[i].eduload_code != 1601090 && req.body.arrayObject[i].eduload_code != 1601080) { 
                let getEduWorkIdLec = null
                let getEduWorkIdPrac = null
                let getEduWorkIdLab = null

                let srs1 = null
                let srs2 = null
                let srs3 = null
                let srs4 = null

                if (req.body.arrayObject[i].teacher_lec && !req.body.arrayObject[i].teacher_prac && !req.body.arrayObject[i].teacher_lab && !req.body.arrayObject[i].teacher_idz) {
                    srs1 = parseFloat(req.body.arrayObject[i].eduload_srs)                  
                } else if (req.body.arrayObject[i].teacher_lec && !req.body.arrayObject[i].teacher_prac && req.body.arrayObject[i].teacher_lab && !req.body.arrayObject[i].teacher_idz) {
                    srs1 = parseFloat(req.body.arrayObject[i].eduload_srs) * 3 / 8
                    srs3 = parseFloat(req.body.arrayObject[i].eduload_srs) * 5 / 8
                } else if (req.body.arrayObject[i].teacher_lec && req.body.arrayObject[i].teacher_prac && !req.body.arrayObject[i].teacher_lab && !req.body.arrayObject[i].teacher_idz) {
                    srs1 = parseFloat(req.body.arrayObject[i].eduload_srs) * 1 / 2
                    srs2 = parseFloat(req.body.arrayObject[i].eduload_srs) * 1 / 2
                } else if (req.body.arrayObject[i].teacher_lec && !req.body.arrayObject[i].teacher_prac && req.body.arrayObject[i].teacher_lab && req.body.arrayObject[i].teacher_idz) {
                    srs1 = parseFloat(req.body.arrayObject[i].eduload_srs) * 1 / 4
                    srs3 = parseFloat(req.body.arrayObject[i].eduload_srs) * 3 / 8
                    srs4 = parseFloat(req.body.arrayObject[i].eduload_srs) * 3 / 8
                } else if (req.body.arrayObject[i].teacher_lec && req.body.arrayObject[i].teacher_prac && !req.body.arrayObject[i].teacher_lab && req.body.arrayObject[i].teacher_idz) {
                    srs1 = parseFloat(req.body.arrayObject[i].eduload_srs) * 1 / 4
                    srs2 = parseFloat(req.body.arrayObject[i].eduload_srs) * 1 / 4
                    srs4 = parseFloat(req.body.arrayObject[i].eduload_srs) * 1 / 2
                } else if (req.body.arrayObject[i].teacher_lec && req.body.arrayObject[i].teacher_prac && req.body.arrayObject[i].teacher_lab && req.body.arrayObject[i].teacher_idz) {
                    srs1 = parseFloat(req.body.arrayObject[i].eduload_srs) * 1 / 4
                    srs2 = parseFloat(req.body.arrayObject[i].eduload_srs) * 1 / 4
                    srs3 = parseFloat(req.body.arrayObject[i].eduload_srs) * 1 / 4
                    srs4 = parseFloat(req.body.arrayObject[i].eduload_srs) * 1 / 4
                }

                if (req.body.arrayObject[i].teacher_idz) { 
                    flag_idz = true 
                    await db.query('update eduload set teacher_idz = $1 where eduload_id = $2', [req.body.arrayObject[i].teacher_idz, req.body.arrayObject[i].eduload_id])                     
                }
                if (req.body.arrayObject[i].teacher_lab) {       
                    flag_lab = true 
                    let lab = null
                    let p_lab = null
                    if (req.body.arrayObject[i].eduload_lab != 0) {
                        lab = req.body.arrayObject[i].eduload_lab
                        p_lab = parseInt(req.body.arrayObject[i].eduload_lab) / 2
                    } else {
                        lab = null
                        p_lab = null
                    }                          
                    getEduWorkIdLab = await db.query('SELECT eduwork_id FROM users u, plan pl, eduwork ed WHERE u.users_login = pl.users_login and pl.plan_id = ed.plan_id and ' +
                    'u.users_name = $1 and u.department_id = $2 and pl.plan_year = $3 and eduwork_semestr = $4', 
                    [req.body.arrayObject[i].teacher_lab, req.user.department_id, req.body.year, semestr])
                    await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_task, dataeduwork_students, dataeduwork_lab, dataeduwork_srs, dataeduwork_p_lab, dataeduwork_year, department_id, eduwork_id) ' + 
                    'values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_type, 
                    req.body.arrayObject[i].eduload_students, lab, srs3, p_lab, req.body.year, req.user.department_id, getEduWorkIdLab.rows[0].eduwork_id])
                    await db.query('update eduload set teacher_lab = $1 where eduload_id = $2', [req.body.arrayObject[i].teacher_lab, req.body.arrayObject[i].eduload_id])
                }
                if (req.body.arrayObject[i].teacher_prac) {
                    flag_practic = true
                    let practic = null
                    let p_prac = null
                    if (req.body.arrayObject[i].eduload_pr != 0) {
                        practic = req.body.arrayObject[i].eduload_pr
                        p_prac = parseInt(req.body.arrayObject[i].eduload_pr) / 2 
                    } else {
                        practic = null
                        p_prac = null
                    }                   
                    getEduWorkIdPrac = await db.query('SELECT eduwork_id FROM users u, plan pl, eduwork ed WHERE u.users_login = pl.users_login and pl.plan_id = ed.plan_id and ' +
                    'u.users_name = $1 and u.department_id = $2 and pl.plan_year = $3 and eduwork_semestr = $4', 
                    [req.body.arrayObject[i].teacher_prac, req.user.department_id, req.body.year, semestr])  
                    await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_task, dataeduwork_students, dataeduwork_prac, dataeduwork_srs, dataeduwork_p_prac, dataeduwork_year, department_id, eduwork_id) ' + 
                    'values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_type, 
                    req.body.arrayObject[i].eduload_students, practic, srs2, p_prac, req.body.year, req.user.department_id, getEduWorkIdPrac.rows[0].eduwork_id])
                    await db.query('update eduload set teacher_prac = $1 where eduload_id = $2', [req.body.arrayObject[i].teacher_prac, req.body.arrayObject[i].eduload_id])
                }
                if (req.body.arrayObject[i].teacher_lec && req.body.arrayObject[i].eduload_code != 1601091 && req.body.arrayObject[i].eduload_code != 1601092 && req.body.arrayObject[i].eduload_code != 1601093) {
                    let practic = null
                    let lab = null
                    let lec = null
                    let p_prac = null
                    let p_lab = null
                    let p_lec = null
                    let zach = null
                    let ekz = null
                    if (flag_practic == false) {
                        if (req.body.arrayObject[i].eduload_pr != 0) {
                            practic = req.body.arrayObject[i].eduload_pr
                            p_prac = parseInt(req.body.arrayObject[i].eduload_pr) / 2 
                        } else {
                            practic = null
                            p_prac = null
                        }                                         
                    }
                    if (flag_lab == false) {
                        if (req.body.arrayObject[i].eduload_lab != 0) {
                            lab = req.body.arrayObject[i].eduload_lab
                            p_lab = parseInt(req.body.arrayObject[i].eduload_lab) / 2
                        } else {
                            lab  = null
                            p_lab = null
                        }
                    }
                    if (req.body.arrayObject[i].eduload_lec != 0 ) {
                        lec = req.body.arrayObject[i].eduload_lec
                        p_lec = req.body.arrayObject[i].eduload_lec
                    } else {
                        lec = null
                        p_lec = null
                    }
                    if (req.body.arrayObject[i].eduload_zach != 0) {
                        zach = req.body.arrayObject[i].eduload_zach
                    } else {
                        zach = null
                    }
                    if (req.body.arrayObject[i].eduload_ekz != 0) {
                        ekz = req.body.arrayObject[i].eduload_ekz
                    } else {
                        ekz = null
                    }
                    getEduWorkIdLec = await db.query('SELECT eduwork_id FROM users u, plan pl, eduwork ed WHERE u.users_login = pl.users_login and pl.plan_id = ed.plan_id and ' +
                    'u.users_name = $1 and u.department_id = $2 and pl.plan_year = $3 and eduwork_semestr = $4', 
                    [req.body.arrayObject[i].teacher_lec, req.user.department_id, req.body.year, semestr])  
                    await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_task, dataeduwork_students, dataeduwork_lec, dataeduwork_prac, dataeduwork_lab, dataeduwork_srs, dataeduwork_zach, dataeduwork_ekz, dataeduwork_p_lec, dataeduwork_p_prac, dataeduwork_p_lab, dataeduwork_year, department_id, eduwork_id) ' + 
                    'values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14, $15, $16, $17)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_type, 
                    req.body.arrayObject[i].eduload_students, lec, practic, lab, srs1, zach, ekz, p_lec, p_prac, p_lab, req.body.year, req.user.department_id, getEduWorkIdLec.rows[0].eduwork_id])
                    await db.query('update eduload set teacher_lec = $1 where eduload_id = $2', [req.body.arrayObject[i].teacher_lec, req.body.arrayObject[i].eduload_id])         
                }
            }
            if (req.body.arrayObject[i].eduload_code == 1601096 || req.body.arrayObject[i].eduload_code == 1601097 || req.body.arrayObject[i].eduload_code == 1601080 || req.body.arrayObject[i].eduload_code == 1601090) {  
                for (let j = 0; j < listDip.rowCount; j++) {
                    if (req.body.arrayObject[i].eduload_group == listDip.rows[j].listdip_group) {                       
                        let getEduWorkId = await db.query('select * from users u, plan pl, eduwork ed where u.users_login = pl.users_login and pl.plan_id = ed.plan_id and u.users_name = $1 and pl.plan_year = $2 and ed.eduwork_semestr = $3',
                        [listDip.rows[j].listdip_teacher_name, req.body.year, semestr])  
                        if (req.body.arrayObject[i].eduload_code == 1601096 || req.body.arrayObject[i].eduload_code == 1601097) {
                            let lead_vkr = parseFloat(req.body.arrayObject[i].eduload_dip)  * parseInt(listDip.rows[j].listdip_students) / parseInt(req.body.arrayObject[i].eduload_students) 
                            await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_task, dataeduwork_students, dataeduwork_lead_vkr, dataeduwork_year, department_id, eduwork_id) ' + 
                            'values($1,$2,$3,$4,$5,$6,$7,$8,$9)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_students, 
                            listDip.rows[j].listdip_students, lead_vkr, req.body.year, req.user.department_id, getEduWorkId.rows[0].eduwork_id]) 
                        } else {
                            let zach  = parseFloat(req.body.arrayObject[i].eduload_zach)  * parseInt(listDip.rows[j].listdip_students) / parseInt(req.body.arrayObject[i].eduload_students)
                            zach = Math.round(zach * 10) / 10 
                            let practic  = parseFloat(req.body.arrayObject[i].eduload_prac)  * parseInt(listDip.rows[j].listdip_students) / parseInt(req.body.arrayObject[i].eduload_students)
                            practic = Math.round(practic * 10) / 10 
                            if (req.body.arrayObject[i].eduload_group.substring(0,2) == 'М-') {
                                await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_students, dataeduwork_p_prod, dataeduwork_year, department_id, eduwork_id) ' + 
                                'values($1,$2,$3,$4,$5,$6,$7,$8)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_students,
                                practic, req.body.year, req.user.department_id, getEduWorkId.rows[0].eduwork_id]) 
                            } else {
                                await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_students, dataeduwork_zach, dataeduwork_p_edu, dataeduwork_year, department_id, eduwork_id) ' + 
                                'values($1,$2,$3,$4,$5,$6,$7,$8,$9)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, listDip.rows[j].listdip_students,
                                zach, practic, req.body.year, req.user.department_id, getEduWorkId.rows[0].eduwork_id])
                                let srs = parseFloat(req.body.arrayObject[i].eduload_prac)  * parseInt(listDip.rows[j].listdip_students) / parseInt(req.body.arrayObject[i].eduload_students) / 3
                                srs = Math.ceil(srs * 10) / 10
                                let getEduWorkIdSem = await db.query('select * from users u, plan pl, eduwork ed where u.users_login = pl.users_login and pl.plan_id = ed.plan_id and u.users_name = $1 and pl.plan_year = $2 and ed.eduwork_semestr = $3',
                                [listDip.rows[j].listdip_teacher_name, req.body.year, 'осенний']) 
                                await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_task, dataeduwork_students, dataeduwork_zach, dataeduwork_srs, dataeduwork_year, department_id, eduwork_id) ' + 
                                'values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_type, listDip.rows[j].listdip_students,
                                zach, srs, req.body.year, req.user.department_id, getEduWorkIdSem.rows[0].eduwork_id])
                            }
                        }
                    }
                }
                if (req.body.arrayObject[i].eduload_code == 1601096 || req.body.arrayObject[i].eduload_code == 1601097) {
                    if (req.body.arrayObject[i].teacher_lec) {                    
                        let getEduWorkId = await db.query('select * from users u, plan pl, eduwork ed where u.users_login = pl.users_login and pl.plan_id = ed.plan_id and u.users_name = $1 and pl.plan_year = $2 and ed.eduwork_semestr = $3',
                        [req.body.arrayObject[i].teacher_lec, req.body.year, semestr])                                                      
                        const checkData = await db.query('select * from dataeduwork de, eduwork ed, plan pl, users u where u.users_login = pl.users_login and pl.plan_id = ed.plan_id ' + 
                        'and ed.eduwork_id = de.eduwork_id and u.users_name = $1 and de.dataeduwork_group = $2 and de.department_id = $3 and de.dataeduwork_year = $4 and de.dataeduwork_name = $5',
                        [req.body.arrayObject[i].teacher_lec, req.body.arrayObject[i].eduload_group, req.user.department_id, req.body.year, req.body.arrayObject[i].eduload_name])                                                                             
                        if (checkData.rowCount == 0) {
                            let gak = 0.5 * parseInt(req.body.arrayObject[i].eduload_students)                  
                            await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_task, dataeduwork_vkr, dataeduwork_year, department_id, eduwork_id) ' + 
                            'values($1,$2,$3,$4,$5,$6,$7,$8)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_students, 
                            gak, req.body.year, req.user.department_id, getEduWorkId.rows[0].eduwork_id])
                        } else {
                            let gak = 0.5 * parseInt(checkData.rows[0].dataeduwork_task)
                            let lead_vkr = parseFloat(req.body.arrayObject[i].eduload_dip)  * parseInt(checkData.rows[0].dataeduwork_students) / parseInt(req.body.arrayObject[i].eduload_students)  
                            await db.query('delete from dataeduwork where dataeduwork_name = $1 and dataeduwork_group = $2 and eduwork_id = $3',
                            [req.body.arrayObject[i].eduload_name, req.body.arrayObject[i].eduload_group, checkData.rows[0].eduwork_id])
                            await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_task, dataeduwork_students, dataeduwork_lead_vkr, dataeduwork_vkr, dataeduwork_year, department_id, eduwork_id) ' + 
                            'values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_students, 
                            checkData.rows[0].dataeduwork_students, lead_vkr, gak, req.body.year, req.user.department_id, getEduWorkId.rows[0].eduwork_id]) 
                        }
                        await db.query('update eduload set teacher_lec = $1 where eduload_id = $2', [req.body.arrayObject[i].teacher_lec, req.body.arrayObject[i].eduload_id])
                    }
                    if (req.body.arrayObject[i].teacher_prac) {
                        let getEduWorkId = await db.query('select * from users u, plan pl, eduwork ed where u.users_login = pl.users_login and pl.plan_id = ed.plan_id and u.users_name = $1 and pl.plan_year = $2 and ed.eduwork_semestr = $3',
                        [req.body.arrayObject[i].teacher_prac, req.body.year, semestr])                                                      
                        const checkData = await db.query('select * from dataeduwork de, eduwork ed, plan pl, users u where u.users_login = pl.users_login and pl.plan_id = ed.plan_id ' + 
                        'and ed.eduwork_id = de.eduwork_id and u.users_name = $1 and de.dataeduwork_group = $2 and de.department_id = $3 and de.dataeduwork_year = $4 and de.dataeduwork_name = $5',
                        [req.body.arrayObject[i].teacher_prac, req.body.arrayObject[i].eduload_group, req.user.department_id, req.body.year, req.body.arrayObject[i].eduload_name])                      
                        if (checkData.rowCount == 0) {
                            let gak = 0.5 * parseInt(req.body.arrayObject[i].eduload_students)                       
                            await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_task, dataeduwork_vkr, dataeduwork_year, department_id, eduwork_id) ' + 
                            'values($1,$2,$3,$4,$5,$6,$7,$8)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_students, 
                            gak, req.body.year, req.user.department_id, getEduWorkId.rows[0].eduwork_id])
                        } else {
                            let gak = 0.5 * parseInt(checkData.rows[0].dataeduwork_task)
                            let lead_vkr = parseFloat(req.body.arrayObject[i].eduload_dip)  * parseInt(checkData.rows[0].dataeduwork_students) / parseInt(req.body.arrayObject[i].eduload_students)  
                            await db.query('delete from dataeduwork where dataeduwork_name = $1 and dataeduwork_group = $2 and eduwork_id = $3',
                            [req.body.arrayObject[i].eduload_name, req.body.arrayObject[i].eduload_group, checkData.rows[0].eduwork_id])
                            await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_task, dataeduwork_students, dataeduwork_lead_vkr, dataeduwork_vkr, dataeduwork_year, department_id, eduwork_id) ' + 
                            'values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_students, 
                            checkData.rows[0].dataeduwork_students, lead_vkr, gak, req.body.year, req.user.department_id, getEduWorkId.rows[0].eduwork_id]) 
                        }
                        await db.query('update eduload set teacher_prac = $1 where eduload_id = $2', [req.body.arrayObject[i].teacher_prac, req.body.arrayObject[i].eduload_id])
                    }
                    if (req.body.arrayObject[i].teacher_lab) {
                        let getEduWorkId = await db.query('select * from users u, plan pl, eduwork ed where u.users_login = pl.users_login and pl.plan_id = ed.plan_id and u.users_name = $1 and pl.plan_year = $2 and ed.eduwork_semestr = $3',
                        [req.body.arrayObject[i].teacher_lab, req.body.year, semestr])                                                      
                        const checkData = await db.query('select * from dataeduwork de, eduwork ed, plan pl, users u where u.users_login = pl.users_login and pl.plan_id = ed.plan_id ' + 
                        'and ed.eduwork_id = de.eduwork_id and u.users_name = $1 and de.dataeduwork_group = $2 and de.department_id = $3 and de.dataeduwork_year = $4 and de.dataeduwork_name = $5',
                        [req.body.arrayObject[i].teacher_lab, req.body.arrayObject[i].eduload_group, req.user.department_id, req.body.year, req.body.arrayObject[i].eduload_name])  
                        if (checkData.rowCount == 0) {
                            let gak = 0.5 * parseInt(req.body.arrayObject[i].eduload_students)                        
                            await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_task, dataeduwork_vkr, dataeduwork_year, department_id, eduwork_id) ' + 
                            'values($1,$2,$3,$4,$5,$6,$7,$8)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_students, 
                            gak, req.body.year, req.user.department_id, getEduWorkId.rows[0].eduwork_id])
                        } else {
                            let gak = 0.5 * parseInt(checkData.rows[0].dataeduwork_task)
                            let lead_vkr = parseFloat(req.body.arrayObject[i].eduload_dip)  * parseInt(checkData.rows[0].dataeduwork_students) / parseInt(req.body.arrayObject[i].eduload_students)  
                            await db.query('delete from dataeduwork where dataeduwork_name = $1 and dataeduwork_group = $2 and eduwork_id = $3',
                            [req.body.arrayObject[i].eduload_name, req.body.arrayObject[i].eduload_group, checkData.rows[0].eduwork_id])
                            await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_task, dataeduwork_students, dataeduwork_lead_vkr, dataeduwork_vkr, dataeduwork_year, department_id, eduwork_id) ' + 
                            'values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_students, 
                            checkData.rows[0].dataeduwork_students, lead_vkr, gak, req.body.year, req.user.department_id, getEduWorkId.rows[0].eduwork_id]) 
                        }
                        await db.query('update eduload set teacher_lab = $1 where eduload_id = $2', [req.body.arrayObject[i].teacher_lab, req.body.arrayObject[i].eduload_id])
                    }
                    if (req.body.arrayObject[i].teacher_idz) {
                        let getEduWorkId = await db.query('select * from users u, plan pl, eduwork ed where u.users_login = pl.users_login and pl.plan_id = ed.plan_id and u.users_name = $1 and pl.plan_year = $2 and ed.eduwork_semestr = $3',
                        [req.body.arrayObject[i].teacher_idz, req.body.year, semestr])                                                      
                        const checkData = await db.query('select * from dataeduwork de, eduwork ed, plan pl, users u where u.users_login = pl.users_login and pl.plan_id = ed.plan_id ' + 
                        'and ed.eduwork_id = de.eduwork_id and u.users_name = $1 and de.dataeduwork_group = $2 and de.department_id = $3 and de.dataeduwork_year = $4 and de.dataeduwork_name = $5',
                        [req.body.arrayObject[i].teacher_idz, req.body.arrayObject[i].eduload_group, req.user.department_id, req.body.year, req.body.arrayObject[i].eduload_name])                                                                 
                        if (checkData.rowCount == 0) { 
                            let gak = 0.5 * parseInt(req.body.arrayObject[i].eduload_students)                      
                            await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_task, dataeduwork_vkr, dataeduwork_year, department_id, eduwork_id) ' + 
                            'values($1,$2,$3,$4,$5,$6,$7,$8)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_students, 
                            gak, req.body.year, req.user.department_id, getEduWorkId.rows[0].eduwork_id])
                        } else {
                            let gak = 0.5 * parseInt(checkData.rows[0].dataeduwork_task)
                            let lead_vkr = parseFloat(req.body.arrayObject[i].eduload_dip)  * parseInt(checkData.rows[0].dataeduwork_students) / parseInt(req.body.arrayObject[i].eduload_students)  
                            await db.query('delete from dataeduwork where dataeduwork_name = $1 and dataeduwork_group = $2 and eduwork_id = $3',
                            [req.body.arrayObject[i].eduload_name, req.body.arrayObject[i].eduload_group, checkData.rows[0].eduwork_id])
                            await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_task, dataeduwork_students, dataeduwork_lead_vkr, dataeduwork_vkr, dataeduwork_year, department_id, eduwork_id) ' + 
                            'values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_students, 
                            checkData.rows[0].dataeduwork_students, lead_vkr, gak, req.body.year, req.user.department_id, getEduWorkId.rows[0].eduwork_id]) 
                        }
                        await db.query('update eduload set teacher_idz = $1 where eduload_id = $2', [req.body.arrayObject[i].teacher_idz, req.body.arrayObject[i].eduload_id])
                    }
                }
            }
            if (req.body.arrayObject[i].eduload_code == 1601091 || req.body.arrayObject[i].eduload_code == 1601092 || req.body.arrayObject[i].eduload_code == 1601093) {                             
                if (req.body.arrayObject[i].teacher_lec) {                
                    let getEduWorkId = await db.query('select * from users u, plan pl, eduwork ed where u.users_login = pl.users_login and pl.plan_id = ed.plan_id and u.users_name = $1 and pl.plan_year = $2 and ed.eduwork_semestr = $3',
                    [req.body.arrayObject[i].teacher_lec, req.body.year, semestr])                           
                    if (req.body.arrayObject[i].eduload_name == 'УЧЕБНАЯ ПРАКТИКА') {                     
                        await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_students, dataeduwork_zach, dataeduwork_p_edu, dataeduwork_year, department_id, eduwork_id) ' + 
                        'values($1,$2,$3,$4,$5,$6,$7,$8,$9)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_students,
                        req.body.arrayObject[i].eduload_zach, req.body.arrayObject[i].eduload_prac, req.body.year, req.user.department_id, getEduWorkId.rows[0].eduwork_id])
                    }
                    else if (req.body.arrayObject[i].eduload_name == 'ПРОИЗВОДСТВЕННАЯ ПРАКТИКА') {                    
                        await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_students, dataeduwork_zach, dataeduwork_p_prod, dataeduwork_year, department_id, eduwork_id) ' + 
                        'values($1,$2,$3,$4,$5,$6,$7,$8,$9)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_students,
                        req.body.arrayObject[i].eduload_zach, req.body.arrayObject[i].eduload_prac, req.body.year, req.user.department_id, getEduWorkId.rows[0].eduwork_id])
                    } else {
                        await db.query('insert into dataeduwork(dataeduwork_name, dataeduwork_kurs, dataeduwork_group, dataeduwork_students, dataeduwork_zach, dataeduwork_p_dip, dataeduwork_year, department_id, eduwork_id) ' + 
                        'values($1,$2,$3,$4,$5,$6,$7,$8,$9)', [req.body.arrayObject[i].eduload_name, kurs, req.body.arrayObject[i].eduload_group, req.body.arrayObject[i].eduload_students,
                        req.body.arrayObject[i].eduload_zach, req.body.arrayObject[i].eduload_prac, req.body.year, req.user.department_id, getEduWorkId.rows[0].eduwork_id])
                    }
                    await db.query('update eduload set teacher_lec = $1 where eduload_id = $2', [req.body.arrayObject[i].teacher_lec, req.body.arrayObject[i].eduload_id])
                }
            }
        }
        res.json({message: 'ok'})
    }
    async deleteDistribution (req, res) {
        await db.query('delete from dataeduwork where department_id = $1 and dataeduwork_year = $2', [req.user.department_id, req.query.year])
        await db.query('update eduload set teacher_lec = $1, teacher_prac = $2, teacher_lab = $3, teacher_idz = $4 where department_id = $5 and eduload_year = $6', 
        [null, null, null, null, req.user.department_id, req.query.year])
        res.send({message: 'ok'})
    }
}

module.exports = new eduLoadController()
