/***************************************************************
 *   Config
 ****************************************************************/
require('./models/userModel')
const init = require('./apiConfig.js')
const mongoose = init.mongoose
const checkInUser = mongoose.model('checkInUser')
const moment = init.moment

const students = require('../students.json')

/***************************************************************
 *  Users List
 ****************************************************************/

function userPost(req, res, next) {
  students.forEach(student => {
    new checkInUser(student).save(function (err) {
      if (err) {
        console.log(err);
        var json = {
          'status': '500',
          'err': err
        }
      } else {
        console.log('save to db')
        var json = {
          'status': '200'
        }
      }
    })
  })
  let json = {
    'status': 200
  }
  next(json)
}

function usersQuery(req, res, next) {
  checkInUser.find(req.query).lean().exec(function (err, users) {
    if (err) {
      console.log(err)
      var json = {
        'status': '500',
        'err': err
      }
      next(json)
    } else if (!users.length) {
      var json = {
        'status': '404'
      }
      next(json)
    } else {
      var json = {
        'status': '200',
        'users': users
      }
      next(json)
    }
  })
}

function userPut(req, res, next) {
  checkInUser.findById(req.params.id).exec(function (err, user) {
    if (err) {
      console.log(err);
      var json = {
        'status': '500',
        'err': err
      }
      next(json)
    } else if (!user) {
      var json = {
        'status': '404'
      }
      next(json)
    } else {
      user.condition = 1
      user.checkedTime = moment(Date.now()).utcOffset(8).format('MM/DD, h:mm a')
      user.updatedAt = moment(Date.now()).utcOffset(8).format('MM/DD, h:mm a')
      user.save(function (err, newUser) {
        if (err) {
          console.log(err)
          var json = {
            'status': '500',
            'err': err
          }
          next(json)
        } else {
          var json = {
            'status': '200',
            'user': newUser
          }
          next(json)
        }
      })
    }
  })
}

module.exports = {
  'post': userPost,
  'get': usersQuery,
  'put': userPut
}