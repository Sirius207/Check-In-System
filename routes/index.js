const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {js: 'app7192'})
})

router.get('/admin', function (req, res, next) {
  res.render('index', {js: 'admin'})
})

module.exports = router
