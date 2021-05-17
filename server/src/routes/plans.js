const express = require('express')
const router = express.Router()
const Plans = require('../models/plans-models')

router.get('/plans', (req, res) => {
    if(req) {   
    Plans.find({}, (err, plans) => {  
      if (err) {
        res.sendStatus(500)
      } else {       
        res.send({ plans: plans })      
      }
    })
  }
  })

  router.post('/plans', (req, res) => {
    const post = new Plans({
      Name: req.body.Name,
      Num: req.body.Num 
    })
    post.save((err, data) => {
      if (err) {
        console.log(err)
      } else {
        res.send({
          success: true,
          message: `Post with ID_${data._id} saved successfully!`
        })
      }
    })
  })
  
  router.delete('/plans/:id', (req, res) => {
    Plans.remove({ _id: req.params.id }, err => {
      if (err) {
        res.sendStatus(500)
      } else {
        res.sendStatus(200)
      }
    })
  })

  router.put('/plans/:id', (req, res) => {
    Plans.findById(req.params.id, (err, post) => {  
      if (err) {
        console.log(err)
      } else {
        if (req.body.Name) {
          post.Name = req.body.Name
        }     
        post.save(err => {
          if (err) {
            res.sendStatus(500)
          } else {
            res.sendStatus(200)
          }
        })
      }
    })
  })

  module.exports = router;