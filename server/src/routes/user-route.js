const Router = require('express')
const router = new Router()
const passport = require('passport')
const eduLoadController = require('../controllers/eduLoad-controller')
const userRegController = require('../controllers/userReg-controller')
const userAuthController = require('../controllers/userAuth-controller')
const mainSecretaryController = require('../controllers/mainSecretary-controller')
const mainTeacherController = require('../controllers/mainTeacher-controller')
const editPlanController = require('../controllers/editPlan-controller')
const contentPlanController = require('../controllers/contentPlan-controller')
const typicalWorkEditorController = require('../controllers/typicalworkEditor-controller')
const mainManagerController = require('../controllers/mainManager-controller')
const dipController = require('../controllers/dip-controller')
const approvedPlansController = require('../controllers/approvedPlans-controller')

//запросы авторизации
router.post('/', userAuthController.Authorization)

//запросы регистрации
router.post('/registration', userRegController.createUser)
router.get('/registration', userRegController.listDepartment)

//запросы страницы учебной нагрузки
router.post('/workloadEditor', passport.authenticate('jwt', {session: false}), eduLoadController.addEduLoad)
router.get('/workloadEditor', passport.authenticate('jwt', {session: false}), eduLoadController.loadContent)
router.put('/workloadEditor', passport.authenticate('jwt', {session: false}), eduLoadController.loadDistribution)
router.delete('/workloadEditor', passport.authenticate('jwt', {session: false}), eduLoadController.deleteDistribution)

//запросы главной страницы секретаря
router.get('/mainSecretary', passport.authenticate('jwt', {session: false}), mainSecretaryController.getListPlans)

//запросы главной страницы преподавателя
router.get('/mainTeacher', passport.authenticate('jwt', {session: false}), mainTeacherController.getListPlans)
router.post('/mainTeacher', passport.authenticate('jwt', {session: false}), mainTeacherController.addPlan)

//запросы главной страницы зав.кафедрой
router.get('/mainManager', passport.authenticate('jwt', {session: false}), mainManagerController.getListPlans)

//запросы редактирования плана
router.get('/editPlan/:id', passport.authenticate('jwt', {session: false}), editPlanController.getPlan)
router.put('/editPlan/:id', passport.authenticate('jwt', {session: false}), editPlanController.updatePlan)

//запросы контента индивидуального плана плана
router.get('/contentPlan/:id', passport.authenticate('jwt', {session: false}), contentPlanController.getContent)
router.delete('/contentPlan/:id', passport.authenticate('jwt', {session: false}), contentPlanController.deleteTypicalWork)
router.post('/contentPlan/:id', passport.authenticate('jwt', {session: false}), contentPlanController.sendMessage)
router.put('/contentPlan/:id', passport.authenticate('jwt', {session: false}), contentPlanController.addAssessment)

//запросы редактора типовых работ
router.get('/typicalworkEditor', passport.authenticate('jwt', {session: false}), typicalWorkEditorController.getTypicalContent)
router.post('/typicalworkEditor', passport.authenticate('jwt', {session: false}), typicalWorkEditorController.addTypicalWorkfromPlan)
router.delete('/typicalworkEditor', passport.authenticate('jwt', {session: false}), typicalWorkEditorController.deleteTypicalWork)

//запросы страницы дипломников
router.get('/listdip', passport.authenticate('jwt', {session: false}), dipController.getContent)
router.post('/listdip', passport.authenticate('jwt', {session: false}), dipController.add)
router.delete('/listdip', passport.authenticate('jwt', {session: false}), dipController.delete)

//запросы страницы списка одобренных планов
router.get('/approvedplans', passport.authenticate('jwt', {session: false}), approvedPlansController.getListPlans)

module.exports = router
