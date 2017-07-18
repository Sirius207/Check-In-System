
var init = require('./apiConfig.js')
var router = init.router

var user = require('./user.js')

router.get('/user', function (req, res) {
  user.get(req, res, function (data) {
    res.json(data)
  })
})

router.put('/reset', function (req, res) {
  user.get(req, res, function (data) {
    data.users.forEach(student => {
      if (student.condition) {
        req.params.id = student._id
        req.body.reset = 1
        user.put(req, res, function (data) {
          console.log(data.user.user_id)
        })
      }
    })
    res.json('reset finished')
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