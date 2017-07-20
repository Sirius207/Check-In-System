const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {js: 'app7202'})
})

router.get('/admin', function (req, res, next) {
  res.render('index', {js: 'admin720'})
})

module.exports = router
