
var init = require('./apiConfig.js')
var router = init.router

var user = require('./user.js')

router.get('/user', function (req, res) {
  user.get(req, res, function (data) {
    res.json(data)
  })
})

// router.post('/user', function (req, res) {
//   user.post(req, res, function (data) {
//     res.json(data)
//   })
// })

router.put('/user/:id', function (req, res) {
  user.put(req, res, function (data) {
    res.json(data)
  })
})

module.exports = router