//
// Init
//

window.onload = init()
function init () {
  console.log('init')
  fetchData()
  .then(function () {
    updateStatistics()
  })
  .catch(function (err) {
    console.log(err)
  })
}

function fetchData () {
  return new Promise(function (resolve, reject) {
    const dataUrl = '/apis/user'
    axios.get(dataUrl)
      .then((rawData) => {
        resolve(checkStatistics(rawData.data.users))
      })
      .catch((error) => {
        reject(error)
      })
  })
}

function checkStatistics (users) {
  const checkText = document.getElementById('check')
  const checkedText = document.getElementById('checked')
  users.forEach(function (user) {
    if (!user.condition) {
      checkText.dataset.count++
    } else {
      checkedText.dataset.count++
    }
  })
}

function updateStatistics () {
  const checkText = document.getElementById('check')
  const checkedText = document.getElementById('checked')
  checkText.innerText = `未報到：${checkText.dataset.count}`
  checkedText.innerText = `已報到：${checkedText.dataset.count}, `
}

//
// Search Process
//

document.search.addEventListener('submit', searchStudent)

function searchStudent (e) {
  e.preventDefault()
  const flashText = document.querySelector('.flash-text')
  const studentID = document.search.searchID.value.toUpperCase()
  const currentStudent = document.querySelector('.current')
  if (currentStudent && currentStudent.id === studentID) {
    flashText.innerText = '請先點擊check進行報到'
    return
  }
  getData(studentID, function (data) {
    if (data.status === '200') {
      showCurrentStudentData(studentID, data.users[0])
    } else {  
      flashText.innerText = '查無此學號'
    }
  })
}

function getData (studentID, next) {
  const dataUrl = `/apis/user?user_id=${studentID}`
  axios.get(dataUrl)
    .then((rawData) => {
      next(rawData.data)
    })
    .catch((error) => {
      next(error.data)
    })
}

function showCurrentStudentData(ID, data) {
  const flashText = document.querySelector('.flash-text')
  if (data.condition) {
    flashText.innerText = '此學員已報到'
  } else {
    flashText.innerText = `您的學院為${data.college}，衣服尺寸為${data.size}，請記住以上資訊，點擊check進行報到後前往下一站。`
    let dom = `
     <ul id="${ID}" class = 'current'>
      <li class="id">${ID}</li>
      <li class="name">${data.name}</li>
      <li class="size">${data.size}</li>
      <li class="size">${data.college}</li>
      <li class="check">
        <button data-id=${data._id} data-type=${data.college} class="checkIn">Check</button>
      </li>
    </ul>
  `
    const list = document.querySelector('.list-item')
    if (!data.check) {
      list.innerHTML = dom + list.innerHTML
    } else {
      list.innerHTML += dom
    }
  }
}

//
// Check In Process
//

document.querySelector('.list-item').addEventListener('click', function (e) {
  if (e.target && e.target.className === 'checkIn') {
    checkIn(e.target)
  }
})

function checkIn (button) {
  const flashText = document.querySelector('.flash-text')
  const checkText = document.getElementById('check')
  const checkedText = document.getElementById('checked')
  showNewBlock(button)
    .then(function () {
      // const audio = new Audio('assets/checkIn.wav')
      // audio.play()
    }).then(function () {
      checkText.dataset.count--
      checkedText.dataset.count++
      checkText.innerText = `未報到：${checkText.dataset.count}`
      checkedText.innerText = `已報到：${checkedText.dataset.count}, `
    }).then(function () {
      play(button)
      flashText.innerText = '請輸入身分證字號進行報到'
    })
    .catch(function (err) {
      console.log(err)
    })
}

function showNewBlock (button) {
  console.log(button)
  return new Promise(function (resolve, reject) {
    const ID = button.dataset.id
    const dataUrl = `/apis/user/${ID}`
    axios.put(dataUrl)
    .then((rawData) => {
      button.parentNode.innerHTML = rawData.data.user.checkedTime
      resolve()
    })
    .catch((error) => {
      reject(error)
    })
  })
}

//
// Play Animation
//

document.querySelector('.list-item').addEventListener('click', function (e) {
  if (e.target && e.target.className === 'play') {
    play(e.target)
  }
})

const videoBlock = document.querySelector('.animation')
function play (button) {
  const animationTable = {
    '米斯提爾': 'Mis',
    '奧莉薇雅': 'Ori',
    '梅里雷特': 'Merry',
    '噩斯邦迪': 'Earth'
  }
  console.log('play')
  videoBlock.classList.add('active')
  const video = document.getElementById(animationTable[button.dataset.type])
  video.style.display = 'block'
  video.classList.add('playing')
  video.play()
  video.addEventListener('ended', hide, false)
}

//
// hide screen
//

const hideButtons = document.querySelectorAll('.hide-button')
hideButtons.forEach((hideButton) => {
  hideButton.addEventListener('click', hide)
})

function hide () {
  const video = document.querySelector('.playing')
  video.style.display = 'none'
  video.classList.remove('playing')
  video.pause()
  videoBlock.classList.remove('active')
  document.querySelector('.current').classList.add('hide')
  document.querySelector('.current').classList.remove('current')
  document.search.searchID.value = ''
}

